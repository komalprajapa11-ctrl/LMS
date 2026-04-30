import mongoose from 'mongoose';

const InterviewQuestionSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  topicId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', default: null },
  question:  { type: String, required: true, trim: true },
  answer:    { type: String, required: true, trim: true },
  difficulty: {
    type: String,
    enum: ['BASIC', 'INTERMEDIATE', 'ADVANCED'],
    default: 'BASIC',
  },
  category: {
    type: String,
    enum: ['Conceptual', 'Coding', 'Behavioral', 'System Design', 'Other'],
    default: 'Conceptual',
  },
  tags: [{ type: String, trim: true }],
}, { timestamps: true });

export default mongoose.models.InterviewQuestion ||
  mongoose.model('InterviewQuestion', InterviewQuestionSchema);
