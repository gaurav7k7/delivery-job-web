import { parseListQuery } from '../utils/pagination.util.js';

/**
 * Generic Mongoose-backed repository: every module-specific repository extends
 * this rather than reimplementing list/create/update/soft-delete/reorder from
 * scratch. Module repositories only need to declare which fields are
 * searchable/filterable/sortable and (optionally) what to populate.
 */
export class BaseRepository {
  constructor(model, options = {}) {
    this.model = model;
    this.searchableFields = options.searchableFields || [];
    this.filterableFields = options.filterableFields || [];
    this.sortableFields = options.sortableFields || ['createdAt', 'updatedAt', 'order'];
    this.defaultSort = options.defaultSort || '-createdAt';
    this.populate = options.populate || null;
  }

  // `.lean()` here is a deliberate perf choice: list/read responses go
  // straight to JSON in the controller layer and never call Mongoose
  // instance methods, so skipping document hydration (change tracking,
  // getters/setters, virtuals machinery) measurably cuts CPU + memory on
  // the hot read path. Mutating paths below (toggleStatus/softDeleteById/
  // restoreById) intentionally query full documents since they call
  // `.save()`.
  async list(query = {}, { select } = {}) {
    const { page, limit, filter, sort, skip } = parseListQuery(query, {
      searchableFields: this.searchableFields,
      filterableFields: this.filterableFields,
      sortableFields: this.sortableFields,
      defaultSort: this.defaultSort,
    });

    let dbQuery = this.model.find(filter).sort(sort).skip(skip).limit(limit).lean();
    if (select) dbQuery = dbQuery.select(select);
    if (this.populate) dbQuery = dbQuery.populate(this.populate);

    const [items, total] = await Promise.all([dbQuery.exec(), this.model.countDocuments(filter)]);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
  }

  async findById(id, { includeDeleted = false, select, lean = true } = {}) {
    const filter = { _id: id };
    if (!includeDeleted) filter.isDeleted = false;
    let dbQuery = this.model.findOne(filter);
    if (lean) dbQuery = dbQuery.lean();
    if (select) dbQuery = dbQuery.select(select);
    if (this.populate) dbQuery = dbQuery.populate(this.populate);
    return dbQuery.exec();
  }

  async create(payload, userId) {
    return this.model.create({ ...payload, createdBy: userId, updatedBy: userId });
  }

  async updateById(id, payload, userId) {
    return this.model.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { ...payload, updatedBy: userId },
      { returnDocument: 'after', runValidators: true }
    );
  }

  async toggleStatus(id, userId) {
    const doc = await this.model.findOne({ _id: id, isDeleted: false });
    if (!doc) return null;
    doc.isActive = !doc.isActive;
    doc.updatedBy = userId;
    return doc.save();
  }

  async softDeleteById(id, userId) {
    const doc = await this.model.findOne({ _id: id, isDeleted: false });
    if (!doc) return null;
    return doc.softDelete(userId);
  }

  async restoreById(id, userId) {
    const doc = await this.model.findOne({ _id: id, isDeleted: true });
    if (!doc) return null;
    return doc.restore(userId);
  }

  async bulkSoftDelete(ids, userId) {
    return this.model.updateMany(
      { _id: { $in: ids }, isDeleted: false },
      { isDeleted: true, isActive: false, updatedBy: userId }
    );
  }

  async reorder(items, userId) {
    if (!Array.isArray(items) || items.length === 0) return { modifiedCount: 0 };
    const operations = items.map(({ id, order }) => ({
      updateOne: { filter: { _id: id }, update: { order, updatedBy: userId } },
    }));
    return this.model.bulkWrite(operations);
  }
}
