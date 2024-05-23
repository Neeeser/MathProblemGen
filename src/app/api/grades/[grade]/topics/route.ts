import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '@/lib/dbConnect';
import Grade, { GradeDocument, TopicDocument, SubtopicDocument, QuestionTypeDocument} from '@/models/Grade';
import Problem, {ProblemDocument} from '@/models/Problem';

export async function POST(request: Request, { params }: { params: { grade: string } }) {
    await dbConnect();
    const { grade } = params;
    const { topic } = await request.json();

    try {
        let gradeDoc = await Grade.findOne({ grade });
        if (!gradeDoc) {
            return NextResponse.json({ error: 'Bad Grade' }, { status: 404 });
        } 

        let topicDoc = gradeDoc.topics.find((t: TopicDocument) => t.topic === topic);
        if (!topicDoc) {
            topicDoc = { topic, subTopics: [] };
            gradeDoc.topics.push(topicDoc);
        } else {
            return NextResponse.json({ error: 'Topic Already Exists' }, { status: 405 });
        }

        
        await gradeDoc.save();

        return NextResponse.json({success: true, data: topicDoc }, { status: 201 });
    } catch (error) {
        console.error('Error saving to grades:', error);
        return NextResponse.json({ error: 'An error occurred while saving to grades' }, { status: 500 });
    }
}

