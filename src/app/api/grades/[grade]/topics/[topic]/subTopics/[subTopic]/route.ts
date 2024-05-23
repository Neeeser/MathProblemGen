import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Grade, { GradeDocument, TopicDocument, SubtopicDocument } from '@/models/Grade';

export async function GET(request: Request, { params }: { params: { grade: string, topic: string, subTopic: string } }) {
    await dbConnect();
    const { grade, topic, subTopic } = params;

    try {
        let gradeDoc = await Grade.findOne({ grade });
        if (!gradeDoc) {
            return NextResponse.json({ error: 'Grade not found' }, { status: 404 });
        }

        let topicDoc = gradeDoc.topics.find((t: TopicDocument) => t.topic === topic);
        if (!topicDoc) {
            return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
        }

        let subtopicDoc = topicDoc.subTopics.find((s: SubtopicDocument) => s.subTopic === subTopic);
        console.log(params);
        console.log(topicDoc.subTopics);
        if (!subtopicDoc) {
            return NextResponse.json({ error: 'Subtopic not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: subtopicDoc }, { status: 200 });
    } catch (error) {
        console.error('Error fetching subtopic:', error);
        return NextResponse.json({ error: 'An error occurred while fetching subtopic' }, { status: 500 });
    }
}