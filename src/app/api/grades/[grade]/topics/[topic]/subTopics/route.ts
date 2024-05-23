// /api/grades/[grade]/topics/[topic]/subTopics/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Grade, { TopicDocument, SubtopicDocument} from '@/models/Grade';

export async function POST(request: Request, { params }: { params: { grade: string, topic: string} }) {
    console.log("GOT");

    await dbConnect();
    console.log("GOTA");
    const { grade, topic } = params;
    console.log(params);
    const { subTopic } = await request.json();

    try {
        let gradeDoc = await Grade.findOne({ grade });
        if (!gradeDoc) {
            return NextResponse.json({ error: 'Bad Grade' }, { status: 404 });
        } 

        console.log("GOT HERE");

        let topicDoc = gradeDoc.topics.find((t: TopicDocument) => t.topic === topic);
        if (!topicDoc) {
            return NextResponse.json({ error: 'Bad Topic' }, { status: 404 });
        }

        console.log("GOT HEREB");
           
        let subtopicDoc = topicDoc.subTopics.find((s: SubtopicDocument) => s.subTopic === subTopic);
        if (!subtopicDoc) {
            subtopicDoc = { subTopic, questionTypes: [] };
            gradeDoc.topics.find((t: TopicDocument) => t.topic === topic).subTopics.push(subtopicDoc);
        } else {
            return NextResponse.json({ error: 'Sub Topic already Exists' }, { status: 404 });
        }

        console.log(subTopic);

        await gradeDoc.save();

        console.log("GOT HERED");

        return NextResponse.json({success: true, data: topicDoc }, { status: 201 });
    } catch (error) {
        console.error('Error saving to grades:', error);
        return NextResponse.json({ error: 'An error occurred while saving to grades' }, { status: 500 });
    }
}

