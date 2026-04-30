import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // Index of the correct option
  explanation: { type: String, default: '' },
});

const QuizSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', default: null }, // Optional: Quiz for a specific topic
  title: { type: String, required: true },
  description: { type: String, default: '' },
  questions: [QuestionSchema],
  timeLimit: { type: Number, default: 10 }, // in minutes
  difficulty: { type: String, enum: ['BASIC', 'INTERMEDIATE', 'ADVANCED'], default: 'BASIC' },
}, { timestamps: true });

export default mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);
