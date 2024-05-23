// /api/grades/[grade]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Grade, { GradeDocument } from '@/models/Grade';

export async function GET(request: Request, { params }: { params: { grade: string } }) {
    await dbConnect();
    const { grade } = params;

    try {
        let gradeDoc = await Grade.findOne({ grade });
        if (!gradeDoc) {
            return NextResponse.json({ error: 'Grade not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: gradeDoc }, { status: 200 });
    } catch (error) {
        console.error('Error fetching subtopic:', error);
        return NextResponse.json({ error: 'An error occurred while fetching subtopic' }, { status: 500 });
    }
}