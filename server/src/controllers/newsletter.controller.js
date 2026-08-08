import { newsletterRepository } from '../repositories/newsletter.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { Newsletter } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { invalidateCache } from '../middlewares/cache.middleware.js';

const base = createCrudController(newsletterRepository, 'Newsletter', 'newsletter');

export const list = base.list;
export const getOne = base.getOne;
export const remove = base.remove;
export const restore = base.restore;
export const bulkRemove = base.bulkRemove;

export const subscribe = async (req, res) => {
  const { email } = req.body;
  const subscriber = await Newsletter.findOneAndUpdate(
    { email },
    { $set: { isSubscribed: true, subscribedAt: new Date() }, $unset: { unsubscribedAt: '' } },
    { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true }
  );
  await invalidateCache('newsletter');
  return new ApiResponse(200, { id: subscriber.id }, 'Subscribed successfully').send(res);
};

export const unsubscribe = async (req, res) => {
  const { email } = req.body;
  await Newsletter.findOneAndUpdate({ email }, { isSubscribed: false, unsubscribedAt: new Date() });
  await invalidateCache('newsletter');
  return new ApiResponse(200, null, 'You have been unsubscribed').send(res);
};
