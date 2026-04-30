import connectDB from "@/lib/mongoose";
import Subject from "@/models/Subject";

// PUT - Update a subject
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, description } = await request.json();

    if (!name || !name.trim()) {
      return Response.json({ message: "Subject name is required" }, { status: 400 });
    }

    await connectDB();

    // Check for duplicate name (excluding current record)
    const existing = await Subject.findOne({ name: name.trim(), _id: { $ne: id } });
    if (existing) {
      return Response.json({ message: "Subject with this name already exists" }, { status: 400 });
    }

    const subject = await Subject.findByIdAndUpdate(
      id,
      { name: name.trim(), description: description?.trim() || '' },
      { new: true }
    );

    if (!subject) {
      return Response.json({ message: "Subject not found" }, { status: 404 });
    }

    return Response.json({ message: "Subject updated successfully", subject });
  } catch (error: any) {
    console.error("Error updating subject:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete a subject
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectDB();

    const subject = await Subject.findByIdAndDelete(id);

    if (!subject) {
      return Response.json({ message: "Subject not found" }, { status: 404 });
    }

    return Response.json({ message: "Subject deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting subject:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
