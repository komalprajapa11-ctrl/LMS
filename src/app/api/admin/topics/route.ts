import connectDB from "@/lib/mongoose";
import Topic from "@/models/Topic";

// GET - List topics for a subject
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');

    if (!subjectId) {
      return Response.json({ message: "subjectId is required" }, { status: 400 });
    }

    await connectDB();
    const topics = await Topic.find({ subjectId }).sort({ order: 1, createdAt: -1 });
    return Response.json({ topics });
  } catch (error: any) {
    console.error("Error fetching topics:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// POST - Create a new topic
export async function POST(request: Request) {
  try {
    const { subjectId, title, sections } = await request.json();

    if (!subjectId || !title?.trim()) {
      return Response.json({ message: "Subject and title are required" }, { status: 400 });
    }

    await connectDB();

    // Get next order number
    const lastTopic = await Topic.findOne({ subjectId }).sort({ order: -1 });
    const order = lastTopic ? lastTopic.order + 1 : 0;

    const topic = await Topic.create({
      subjectId,
      title: title.trim(),
      order,
      sections: sections || [],
    });

    return Response.json({ message: "Topic created successfully", topic }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating topic:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
