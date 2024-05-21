// /app/api/grades/route.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '../../../lib/dbConnect';
import Grade, { GradeDocument, TopicDocument, SubtopicDocument, QuestionTypeDocument} from '../../../models/Grade';
import Problem, {ProblemDocument} from '../../../models/Problem';

export async function POST(request: Request) {
    await dbConnect();
    const { grade, topic, subtopic, questionType, originalProblem, generalizedProblem, variables, answer } = await request.json();
    try {
        // Find the grade or create a new one if it doesn't exist
        let gradeDoc = await Grade.findOne({ grade });
        if (!gradeDoc) {
            gradeDoc = new Grade({ grade, topics: [] });
        }

        // Find the topic or create a new one if it doesn't exist
        let topicDoc = gradeDoc.topics.find((t: TopicDocument) => t.topic === topic);
        if (!topicDoc) {
            topicDoc = { topic, subtopics: [] };
            gradeDoc.topics.push(topicDoc);
        }

        // Find the subtopic or create a new one if it doesn't exist
        let subtopicDoc = topicDoc.subtopics.find((s: SubtopicDocument) => s.subtopic === subtopic);
        if (!subtopicDoc) {
            subtopicDoc = { subtopic, questionTypes: [] };
            //find(t => t.topic === topicName);
            gradeDoc.topics.find((t: TopicDocument) => t.topic === topic).subtopics.push(subtopicDoc);
        }

        // Find the question type or create a new one if it doesn't exist
        let questionTypeDoc = subtopicDoc.questionTypes.find((q: QuestionTypeDocument) => q.questionType === questionType);
        if (!questionTypeDoc) {
            questionTypeDoc = { questionType, problems: [] };
            gradeDoc.topics.find((t: TopicDocument) => t.topic === topic).subtopics.find((s: SubtopicDocument) => s.subtopic === subtopic).questionTypes.push(questionTypeDoc);
        }

        // Create a new problem document
        const problemDoc: ProblemDocument = new Problem({
            problemId: uuidv4(),
            originalProblem,
            generalizedProblem,
            generatedProblems: [],
            variables,
            answer,
        });

        await problemDoc.save();

        // Add the problem to the question type
        gradeDoc.topics.find((t: TopicDocument) => t.topic === topic).subtopics.find((s: SubtopicDocument) => s.subtopic === subtopic).questionTypes.find((q: QuestionTypeDocument) => q.questionType === questionType).problems.push(problemDoc);

        // Save the changes
        await gradeDoc.save();

        return NextResponse.json({success: true, data: problemDoc }, { status: 201 });
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
            path: 'subtopics',
            populate: {
                path: 'questionTypes',
                populate: {
                    path: 'problems',
                    model: 'Problem',
                },
            },
        },
    });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    try {
        const query = {
            $or: [
                { originalProblem: { $regex: search, $options: 'i' } },
                { generalizedProblem: { $regex: search, $options: 'i' } },
                { topic: { $regex: search, $options: 'i' } },
            ],
        };

        const totalProblems = await Problem.countDocuments(query);
        const problems: ProblemDocument[] = await Problem.find(query)
            .skip(startIndex)
            .limit(limit);

        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(totalProblems / limit),
            totalProblems,
        };
        console.log('Problems:', problems, 'Pagination:', pagination)
        return NextResponse.json({ success: true, gradeData: grades, data: problems, pagination }, { status: 200 });
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
