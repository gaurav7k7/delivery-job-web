import { BaseRepository } from './base.repository.js';
import { TeamMember } from '../models/index.js';

export const teamMemberRepository = new BaseRepository(TeamMember, {
  searchableFields: ['name', 'designation', 'department'],
  filterableFields: ['isLeadership', 'department'],
  sortableFields: ['createdAt', 'updatedAt', 'order', 'name'],
  defaultSort: 'order',
});
