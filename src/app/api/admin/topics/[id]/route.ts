import connectDB from "@/lib/mongoose";
import Topic from "@/models/Topic";

// GET - Get a single topic by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const topic = await Topic.findById(id);
    if (!topic) {
      return Response.json({ message: "Topic not found" }, { status: 404 });
    }

    return Response.json({ topic });
  } catch (error: any) {
    console.error("Error fetching topic:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update a topic
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, sections } = await request.json();

    if (!title?.trim()) {
      return Response.json({ message: "Title is required" }, { status: 400 });
    }

    await connectDB();

    const topic = await Topic.findByIdAndUpdate(
      id,
      { title: title.trim(), sections: sections || [] },
      { new: true }
    );

    if (!topic) {
      return Response.json({ message: "Topic not found" }, { status: 404 });
    }

    return Response.json({ message: "Topic updated successfully", topic });
  } catch (error: any) {
    console.error("Error updating topic:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete a topic
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const topic = await Topic.findByIdAndDelete(id);
    if (!topic) {
      return Response.json({ message: "Topic not found" }, { status: 404 });
    }

    return Response.json({ message: "Topic deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting topic:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
