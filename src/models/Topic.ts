import mongoose from 'mongoose';

const SectionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['HEADING', 'TEXT', 'BULLETS', 'CODE', 'NOTE'],
    required: true,
  },
  content: { type: String, required: true },
  language: { type: String, default: '' }, // For CODE type: 'html', 'css', 'javascript', etc.
  order: { type: Number, default: 0 },
});

const TopicSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', default: null },
  title: { type: String, required: true, trim: true },
  order: { type: Number, default: 0 },
  sections: [SectionSchema],
}, { timestamps: true });

export default mongoose.models.Topic || mongoose.model('Topic', TopicSchema);
