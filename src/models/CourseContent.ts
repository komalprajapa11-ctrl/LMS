import mongoose from 'mongoose';

const CourseContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: 'Web Development' },
  type: { type: String, enum: ['SUBJECT', 'DOCUMENT', 'NOTES', 'QUIZ'], default: 'SUBJECT' },
  content: { type: String }, // Markdown or HTML content
  fileUrl: { type: String },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseContent', default: null }, // For nesting
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.CourseContent || mongoose.model('CourseContent', CourseContentSchema);
