import { Homepage } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { invalidateCache } from '../middlewares/cache.middleware.js';

const SINGLETON_FILTER = { singletonKey: 'homepage' };

// Sensible default section layout for a brand-new database, matching the
// sections defined in docs/VISUAL-DESIGN-SPEC.md — an admin can reorder,
// hide, or rename any of these afterward.
const DEFAULT_SECTIONS = [
  'hero',
  'statistics',
  'services',
  'industries',
  'why-choose-us',
  'process',
  'technology-stack',
  'case-studies',
  'testimonials',
  'clients',
  'achievements',
  'awards',
  'faq',
  'latest-blogs',
  'career',
  'cta',
  'contact',
].map((key, index) => ({ key, isVisible: true, order: index }));

export const get = async (req, res) => {
  const homepage = await Homepage.findOneAndUpdate(
    SINGLETON_FILTER,
    { $setOnInsert: { sections: DEFAULT_SECTIONS } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );
  return new ApiResponse(200, homepage).send(res);
};

export const update = async (req, res) => {
  const homepage = await Homepage.findOneAndUpdate(
    SINGLETON_FILTER,
    { $set: { ...req.body, updatedBy: req.user.id } },
    { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true }
  );
  await invalidateCache('homepage');
  return new ApiResponse(200, homepage, 'Homepage layout updated').send(res);
};
