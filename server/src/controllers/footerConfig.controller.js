import { FooterConfig } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { invalidateCache } from '../middlewares/cache.middleware.js';

const SINGLETON_FILTER = { singletonKey: 'footer_config' };

export const get = async (req, res) => {
  const footer = await FooterConfig.findOneAndUpdate(
    SINGLETON_FILTER,
    {},
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );
  return new ApiResponse(200, footer).send(res);
};

export const update = async (req, res) => {
  const footer = await FooterConfig.findOneAndUpdate(
    SINGLETON_FILTER,
    { $set: { ...req.body, updatedBy: req.user.id } },
    { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true }
  );
  await invalidateCache('footer');
  return new ApiResponse(200, footer, 'Footer configuration updated').send(res);
};
