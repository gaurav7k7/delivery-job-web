import { SiteSetting } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { invalidateCache } from '../middlewares/cache.middleware.js';

const SINGLETON_FILTER = { singletonKey: 'site_settings' };

// Only used the very first time this document is created (a fresh database)
// so the public site has something sensible to render before an admin has
// configured anything through the dashboard.
const DEFAULTS = {
  siteName: 'Zerivon',
  tagline: 'Your trusted rider-onboarding partner',
};

function withoutOverlap(defaults, body) {
  return Object.fromEntries(Object.entries(defaults).filter(([key]) => body[key] === undefined));
}

export const get = async (req, res) => {
  const settings = await SiteSetting.findOneAndUpdate(
    SINGLETON_FILTER,
    { $setOnInsert: DEFAULTS },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
  );
  return new ApiResponse(200, settings).send(res);
};

export const update = async (req, res) => {
  const settings = await SiteSetting.findOneAndUpdate(
    SINGLETON_FILTER,
    {
      $set: { ...req.body, updatedBy: req.user.id },
      $setOnInsert: withoutOverlap(DEFAULTS, req.body),
    },
    { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true }
  );
  await invalidateCache('settings');
  return new ApiResponse(200, settings, 'Site settings updated').send(res);
};
