import connectDB from "@/lib/mongoose";
import Quiz from "@/models/Quiz";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');

    if (!subjectId) {
      return Response.json({ message: "subjectId is required" }, { status: 400 });
    }

    await connectDB();
    const quizzes = await Quiz.find({ subjectId }).sort({ createdAt: -1 });
    return Response.json({ quizzes });
  } catch (error: any) {
    console.error("Error fetching quizzes:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
