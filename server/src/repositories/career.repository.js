import { BaseRepository } from './base.repository.js';
import { Career } from '../models/index.js';

export const careerRepository = new BaseRepository(Career, {
  searchableFields: ['title', 'department', 'location'],
  filterableFields: ['department', 'employmentType', 'experienceLevel', 'status'],
  sortableFields: ['createdAt', 'updatedAt', 'title', 'applicationDeadline'],
  defaultSort: '-createdAt',
});
