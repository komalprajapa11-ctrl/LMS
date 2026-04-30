import connectDB from '@/lib/mongoose';
import InterviewQuestion from '@/models/InterviewQuestion';

// GET  /api/admin/interview-questions?subjectId=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');
    await connectDB();
    const filter: any = subjectId ? { subjectId } : {};
    const questions = await InterviewQuestion.find(filter).sort({ difficulty: 1, createdAt: -1 });
    return Response.json({ questions });
  } catch (error: any) {
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/interview-questions
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { subjectId, question, answer } = data;

    if (!subjectId || !question?.trim() || !answer?.trim()) {
      return Response.json({ message: 'subjectId, question and answer are required' }, { status: 400 });
    }

    await connectDB();
    const doc = await InterviewQuestion.create({
      ...data,
      question: question.trim(),
      answer: answer.trim(),
    });
    return Response.json({ message: 'Interview question created', question: doc }, { status: 201 });
  } catch (error: any) {
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
