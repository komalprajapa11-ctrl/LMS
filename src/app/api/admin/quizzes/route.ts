import connectDB from "@/lib/mongoose";
import Quiz from "@/models/Quiz";

export async function GET() {
  try {
    await connectDB();
    const quizzes = await Quiz.find({}).sort({ createdAt: -1 });
    return Response.json({ quizzes });
  } catch (error: any) {
    console.error("Error fetching admin quizzes:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await connectDB();
    const quiz = await Quiz.create(data);
    return Response.json({ message: "Quiz created successfully", quiz });
  } catch (error: any) {
    console.error("Error creating quiz:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
