import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Grade, { GradeDocument, TopicDocument, SubtopicDocument, QuestionTypeDocument } from '@/models/Grade';
import Problem, {ProblemDocument} from '@/models/Problem';

export async function GET(request: Request, { params }: { params: { grade: string, topic: string, subTopic: string, questionType: string, problemId: string } }) {
    await dbConnect();
    const { grade, topic, subTopic, questionType, problemId } = params;

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
        if (!subtopicDoc) {
            return NextResponse.json({ error: 'Subtopic not found' }, { status: 404 });
        }

        let questionTypeDoc = subtopicDoc.questionTypes.find((q: QuestionTypeDocument) => q.questionType === questionType);
        if (!questionTypeDoc) {
            return NextResponse.json({ error: 'QuestionType not found' }, { status: 404 });
        }

        let problemDoc = questionTypeDoc.problems.find((p: ProblemDocument) => p.problemId === problemId);
        if (!problemDoc) {
            return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: problemDoc }, { status: 200 });
    } catch (error) {
        console.error('Error fetching subtopic:', error);
        return NextResponse.json({ error: 'An error occurred while fetching subtopic' }, { status: 500 });
    }
}

