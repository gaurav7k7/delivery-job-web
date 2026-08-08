import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { attachSlug } from '../utils/slugify.js';

const roleSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, trim: true, lowercase: true },
    description: { type: String, trim: true },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
    isSystem: { type: Boolean, default: false }, // system roles (e.g. super_admin) cannot be deleted
  },
  { timestamps: true }
);

attachSlug(roleSchema, 'name');
roleSchema.plugin(auditablePlugin);

roleSchema.index({ slug: 1 }, { unique: true });

export default model('Role', roleSchema);
