// /app/api/problem/route.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '../../../lib/dbConnect';
import Problem, { ProblemDocument } from '../../../models/Problem';

export async function POST(request: Request) {
    await dbConnect();

    let { originalProblem, generalizedProblem, variables, grade, topic, answer } = await request.json();

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
    return NextResponse.json({ message: 'GET method not implemented' }, { status: 405 });
}

export async function PUT(request: Request) {
    return NextResponse.json({ message: 'PUT method not implemented' }, { status: 405 });
}

export async function DELETE(request: Request) {
    return NextResponse.json({ message: 'DELETE method not implemented' }, { status: 405 });
}