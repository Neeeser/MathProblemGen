// /app/api/problem/route.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '../../../lib/dbConnect';
import Problem, { ProblemDocument } from '../../../models/Problem';

export async function POST(request: Request) {
    await dbConnect();

    let { originalProblem, generalizedProblem, variables, grade, topic, answer } = await request.json();

    topic = topic.toLowerCase();
    try {
        const problem: ProblemDocument = new Problem({
            problemId: uuidv4(),
            originalProblem,
            generalizedProblem,
            generatedProblems: [],
            variables,
            grade,
            topic,
            answer,
        });

        await problem.save();

        return NextResponse.json({ success: true, data: problem }, { status: 201 });
    } catch (error) {
        console.error('Error saving problem:', error);
        return NextResponse.json({ success: false, error: 'Error saving problem' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    await dbConnect();

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
        return NextResponse.json({ success: true, data: problems, pagination }, { status: 200 });
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