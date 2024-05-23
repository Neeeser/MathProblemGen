// /api/grades/[grade]/topics/[topic]/subtopics/[subtopic]/questionTypes/[questionType]/problems/[problemId]/generated/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Grade, { GradeDocument, TopicDocument, SubtopicDocument, QuestionTypeDocument } from '@/models/Grade';
import Problem, {ProblemDocument} from '@/models/Problem';

export async function POST(request: Request, { params }: { params: { grade: string, topic: string, subTopic: string, questionType: string, problemId: string } }) {
    await dbConnect();
    const { grade, topic, subTopic, questionType, problemId } = params;
    const { generatedProblems } = await request.json();
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

        gradeDoc.topics.find((t: TopicDocument) => t.topic === topic).subTopics.find((s: SubtopicDocument) => s.subTopic === subTopic).questionTypes.find((q: QuestionTypeDocument) => q.questionType === questionType).problems.find((p: ProblemDocument) => p.problemId === problemId).generatedProblems.push(...generatedProblems);

        await gradeDoc.save();

        return NextResponse.json({ success: true, data: problemDoc }, { status: 200 });
    } catch (error) {
        console.error('Error saving generated qustions', error);
        return NextResponse.json({ error: 'An error saving generated qustions' }, { status: 500 });
    }
}




