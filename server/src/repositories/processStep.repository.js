import { BaseRepository } from './base.repository.js';
import { ProcessStep } from '../models/index.js';

export const processStepRepository = new BaseRepository(ProcessStep, {
  searchableFields: ['title', 'description'],
  filterableFields: ['page'],
  sortableFields: ['createdAt', 'updatedAt', 'order', 'stepNumber'],
  defaultSort: 'stepNumber',
});
