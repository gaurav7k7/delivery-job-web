import { heroBannerRepository } from '../repositories/heroBanner.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { HeroBanner } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const base = createCrudController(heroBannerRepository, 'HeroBanner', 'hero-banners');

export const list = base.list;
export const getOne = base.getOne;
export const create = base.create;
export const update = base.update;
export const toggleStatus = base.toggleStatus;
export const remove = base.remove;
export const restore = base.restore;
export const reorder = base.reorder;

export const listPublicByPage = async (req, res) => {
  const now = new Date();
  const banners = await HeroBanner.find({
    page: req.params.page,
    isActive: true,
    isDeleted: false,
    $and: [
      { $or: [{ startDate: null }, { startDate: { $exists: false } }, { startDate: { $lte: now } }] },
      { $or: [{ endDate: null }, { endDate: { $exists: false } }, { endDate: { $gte: now } }] },
    ],
  })
    .sort('order')
    .lean();
  return new ApiResponse(200, banners).send(res);
};
