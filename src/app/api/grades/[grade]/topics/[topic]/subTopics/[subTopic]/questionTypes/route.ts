// /api/grades/[grade]/topics/[topic]/subTopics/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Grade, { TopicDocument, SubtopicDocument, QuestionTypeDocument} from '@/models/Grade';

export async function POST(request: Request, { params }: { params: { grade: string, topic: string, subTopic: string } }) {
    await dbConnect();
    const { grade, topic, subTopic } = params;
    const { questionType } = await request.json();

    try {
        let gradeDoc = await Grade.findOne({ grade });
        if (!gradeDoc) {
            return NextResponse.json({ error: 'Bad Grade' }, { status: 404 });
        } 

        let topicDoc = gradeDoc.topics.find((t: TopicDocument) => t.topic === topic);
        if (!topicDoc) {
            return NextResponse.json({ error: 'Bad Topic' }, { status: 404 });
        }
           
        let subtopicDoc = topicDoc.subTopics.find((s: SubtopicDocument) => s.subTopic === subTopic);
        if (!subtopicDoc) {
            return NextResponse.json({ error: 'Bad Sub Topic' }, { status: 404 });
        } 

        let questionTypeDoc = subtopicDoc.questionTypes.find((q: QuestionTypeDocument) => q.questionType === questionType);
        if (!questionTypeDoc) {
            questionTypeDoc = { questionType, problems: [] };
            gradeDoc.topics.find((t: TopicDocument) => t.topic === topic).subTopics.find((s: SubtopicDocument) => s.subTopic === subTopic).questionTypes.push(questionTypeDoc);
        } else {
            return NextResponse.json({ error: 'Question Type Already Exists' }, { status: 404 });
        }

        await gradeDoc.save();

        return NextResponse.json({success: true, data: topicDoc }, { status: 201 });
    } catch (error) {
        console.error('Error saving to grades:', error);
        return NextResponse.json({ error: 'An error occurred while saving to grades' }, { status: 500 });
    }
}

