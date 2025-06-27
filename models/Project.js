import mongoose from 'mongoose';
import slugify from 'slugify';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  slug: { type: String, unique: true },
  image: String,
  github: String,
  technologies: {
    frontend: [String],
    backend: [String],
  },
  demo: String,
  isDeleted: { type: Boolean, default: false }, 
}, {
  timestamps: true,
});

projectSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model('Project', projectSchema);
