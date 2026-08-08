import { blogRepository } from '../repositories/blog.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { Blog } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { invalidateCache } from '../middlewares/cache.middleware.js';
import { parseListQuery } from '../utils/pagination.util.js';

const base = createCrudController(blogRepository, 'Blog', 'blog');

export const list = base.list;
export const getOne = base.getOne;
export const toggleStatus = base.toggleStatus;
export const remove = base.remove;
export const restore = base.restore;
export const bulkRemove = base.bulkRemove;

// Stamps publishedAt the moment a post first transitions into "published",
// so scheduling/backdating never happens by accident on a later edit.
function withPublishedAt(payload, previousStatus) {
  if (payload.status === 'published' && previousStatus !== 'published') {
    return { ...payload, publishedAt: new Date() };
  }
  return payload;
}

export const create = async (req, res) => {
  const payload = withPublishedAt({ ...req.body, author: req.body.author || req.user.id }, null);
  const doc = await blogRepository.create(payload, req.user.id);
  await invalidateCache('blog');
  return new ApiResponse(201, doc, 'Blog post created').send(res);
};

export const update = async (req, res) => {
  const existing = await Blog.findOne({ _id: req.params.id, isDeleted: false }).select('status');
  if (!existing) throw ApiError.notFound('Blog post not found');

  const payload = withPublishedAt(req.body, existing.status);
  const doc = await blogRepository.updateById(req.params.id, payload, req.user.id);
  await invalidateCache('blog');
  return new ApiResponse(200, doc, 'Blog post updated').send(res);
};

export const listPublic = async (req, res) => {
  const { page, limit, filter, sort, skip } = parseListQuery(req.query, {
    searchableFields: ['title', 'excerpt', 'content'],
    filterableFields: ['category'],
    sortableFields: ['publishedAt', 'views', 'title'],
    defaultSort: '-publishedAt',
  });
  filter.status = 'published';

  const [items, total] = await Promise.all([
    Blog.find(filter)
      .select('title slug excerpt coverImage category tags author publishedAt readTimeMinutes isFeatured views')
      .populate({ path: 'author', select: 'name avatar' })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Blog.countDocuments(filter),
  ]);

  return new ApiResponse(200, items, 'Blog list fetched', {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  }).send(res);
};

export const getPublicBySlug = async (req, res) => {
  const blog = await Blog.findOneAndUpdate(
    { slug: req.params.slug, status: 'published', isDeleted: false },
    { $inc: { views: 1 } },
    { returnDocument: 'after' }
  ).populate({ path: 'author', select: 'name avatar' });

  if (!blog) throw ApiError.notFound('Blog post not found');
  return new ApiResponse(200, blog).send(res);
};

export const listPublicCategories = async (req, res) => {
  const categories = await Blog.distinct('category', { status: 'published', isDeleted: false });
  return new ApiResponse(200, categories.sort()).send(res);
};
