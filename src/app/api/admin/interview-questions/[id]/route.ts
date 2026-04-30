import connectDB from '@/lib/mongoose';
import InterviewQuestion from '@/models/InterviewQuestion';

// GET /api/admin/interview-questions/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const question = await InterviewQuestion.findById(id);
    if (!question) return Response.json({ message: 'Not found' }, { status: 404 });
    return Response.json({ question });
  } catch {
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/interview-questions/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const { question, answer } = data;

    if (!question?.trim() || !answer?.trim()) {
      return Response.json({ message: 'Question and answer are required' }, { status: 400 });
    }

    await connectDB();
    const updated = await InterviewQuestion.findByIdAndUpdate(
      id,
      { ...data, question: question.trim(), answer: answer.trim() },
      { new: true }
    );
    if (!updated) return Response.json({ message: 'Not found' }, { status: 404 });
    return Response.json({ message: 'Updated successfully', question: updated });
  } catch {
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/interview-questions/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const deleted = await InterviewQuestion.findByIdAndDelete(id);
    if (!deleted) return Response.json({ message: 'Not found' }, { status: 404 });
    return Response.json({ message: 'Deleted successfully' });
  } catch {
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
