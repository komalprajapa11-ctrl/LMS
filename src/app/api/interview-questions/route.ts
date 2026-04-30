import connectDB from '@/lib/mongoose';
import InterviewQuestion from '@/models/InterviewQuestion';

// GET /api/interview-questions?subjectId=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');
    const difficulty = searchParams.get('difficulty');

    if (!subjectId) {
      return Response.json({ message: 'subjectId is required' }, { status: 400 });
    }

    await connectDB();
    const filter: any = { subjectId };
    if (difficulty) filter.difficulty = difficulty;

    const questions = await InterviewQuestion.find(filter).sort({ difficulty: 1, createdAt: -1 });
    return Response.json({ questions });
  } catch (error: any) {
    console.error('Error fetching interview questions:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
