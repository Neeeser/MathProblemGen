// /app/api/grades/route.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '../../../lib/dbConnect';
import Grade, { GradeDocument} from '../../../models/Grade';

export async function POST(request: Request) {
    const { grade } = await request.json();
    await dbConnect();

    try {
        console.log("GOT HERE");
        let gradeDoc = await Grade.findOne({ grade });
        console.log("GOT HEREA");
        if (!gradeDoc) {
            gradeDoc = new Grade({ grade, topics: [] });
            console.log("SHOULD");
        } else {
            return NextResponse.json({ error: 'Grade Already Exists' }, { status: 405 });
        }
        console.log("GOT HEREB");
        // Save the changes
        await gradeDoc.save();
        console.log("GOT HEREC");

        return NextResponse.json({success: true, data: gradeDoc }, { status: 201 });
    } catch (error) {
        console.error('Error saving to grades:', error);
        return NextResponse.json({ error: 'An error occurred while saving to grades' }, { status: 500 });
    }

}


export async function GET(request: Request) {
    await dbConnect();

    const grades: GradeDocument[] = await Grade.find().populate({
        path: 'topics',
        populate: {
            path: 'subTopics',
            populate: {
                path: 'questionTypes',
                populate: {
                    path: 'problems',
                    model: 'Problem',
                },
            },
        },
    });

    try {
        // Retrieve the generated problems from the grade system
        const generatedProblems = grades.flatMap((grade) =>
            grade.topics.flatMap((topic) =>
                topic.subTopics.flatMap((subTopic) =>
                    subTopic.questionTypes.flatMap((questionType) =>
                        questionType.problems.flatMap((problem) => problem.generatedProblems)
                    )
                )
            )
        );

        return NextResponse.json({ success: true, gradeData: grades, generatedProblems }, { status: 200 });
    } catch (error) {
        console.error('Error fetching problems:', error);
        return NextResponse.json({ success: false, error: 'Error fetching problems' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    return NextResponse.json({ message: 'PUT method not implemented' }, { status: 405 });
}

export async function DELETE(request: Request) {
    return NextResponse.json({ message: 'DELETE method not implemented' }, { status: 405 });
}
