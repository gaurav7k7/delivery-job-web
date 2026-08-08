import { Schema } from 'mongoose';

/**
 * Adds the standard governance fields (isActive, isDeleted, createdBy, updatedBy)
 * plus soft-delete helpers to every collection that uses it. Applied uniformly
 * across all models per the project's data-governance requirement.
 */
export function auditablePlugin(schema, options = {}) {
  const { requireCreatedBy = false } = options;

  schema.add({
    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: requireCreatedBy },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  });

  schema.index({ isDeleted: 1, isActive: 1 });

  schema.statics.findActive = function findActive(filter = {}) {
    return this.find({ ...filter, isDeleted: false, isActive: true });
  };

  schema.methods.softDelete = function softDelete(userId) {
    this.isDeleted = true;
    this.isActive = false;
    if (userId) this.updatedBy = userId;
    return this.save();
  };

  schema.methods.restore = function restore(userId) {
    this.isDeleted = false;
    this.isActive = true;
    if (userId) this.updatedBy = userId;
    return this.save();
  };
}
