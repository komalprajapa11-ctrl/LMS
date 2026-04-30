import connectDB from "@/lib/mongoose";
import Subject from "@/models/Subject";

export async function GET() {
  try {
    await connectDB();
    const subjects = await Subject.find({ status: 'ACTIVE' }).sort({ createdAt: -1 });
    return Response.json({ subjects });
  } catch (error: any) {
    console.error("Error fetching subjects:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
