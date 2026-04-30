import connectDB from "@/lib/mongoose";
import Topic from "@/models/Topic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');

    if (!subjectId) {
      return Response.json({ message: "subjectId is required" }, { status: 400 });
    }

    await connectDB();
    let topics = await Topic.find({ subjectId }).sort({ order: 1 }).lean();
    
    // Sort to ensure children follow parents
    const structuredTopics: any[] = [];
    const parentTopics = topics.filter((t: any) => !t.parentId);
    
    parentTopics.forEach((parent: any) => {
      structuredTopics.push(parent);
      const children = topics.filter((t: any) => t.parentId?.toString() === parent._id.toString());
      structuredTopics.push(...children);
    });

    return Response.json({ topics: structuredTopics });
  } catch (error: any) {
    console.error("Error fetching topics:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
