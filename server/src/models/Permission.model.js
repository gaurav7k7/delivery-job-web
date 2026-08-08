import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';

const permissionSchema = new Schema(
  {
    key: { type: String, required: true, trim: true, lowercase: true, unique: true }, // e.g. "blog:publish"
    module: { type: String, required: true, trim: true, lowercase: true, index: true },
    action: {
      type: String,
      required: true,
      enum: ['create', 'read', 'update', 'delete', 'publish', 'manage'],
    },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

permissionSchema.plugin(auditablePlugin);

permissionSchema.index({ module: 1, action: 1 });

export default model('Permission', permissionSchema);
