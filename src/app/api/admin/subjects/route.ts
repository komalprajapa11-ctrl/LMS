import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Subject from "@/models/Subject";

// GET - List all subjects
export async function GET() {
  try {
    await connectDB();
    const subjects = await Subject.find().sort({ createdAt: -1 });
    return Response.json({ subjects });
  } catch (error: any) {
    console.error("Error fetching subjects:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// POST - Create a new subject
export async function POST(request: Request) {
  try {
    const { name, description } = await request.json();

    if (!name || !name.trim()) {
      return Response.json({ message: "Subject name is required" }, { status: 400 });
    }

    await connectDB();

    // Check for duplicate name
    const existing = await Subject.findOne({ name: name.trim() });
    if (existing) {
      return Response.json({ message: "Subject with this name already exists" }, { status: 400 });
    }

    const subject = await Subject.create({
      name: name.trim(),
      description: description?.trim() || '',
    });

    return Response.json({ message: "Subject created successfully", subject }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating subject:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
