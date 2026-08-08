import { BaseRepository } from './base.repository.js';
import { JobApplication } from '../models/index.js';

export const jobApplicationRepository = new BaseRepository(JobApplication, {
  searchableFields: ['fullName', 'email'],
  filterableFields: ['job', 'status'],
  sortableFields: ['createdAt', 'updatedAt', 'fullName'],
  defaultSort: '-createdAt',
  populate: { path: 'job', select: 'title department location' },
});
