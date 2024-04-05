// /app/api/problem/[problemId]/generated/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import Problem, { ProblemDocument } from '../../../../../models/Problem';

interface GeneratedProblem {
    problem: string;
    answer: string;
}

export async function POST(request: Request, { params }: { params: { problemId: string } }) {
    const { problemId } = params;

    await dbConnect();

    const { problem, answer } = await request.json();

    try {
        const existingProblem: ProblemDocument | null = await Problem.findOne({ problemId });

        if (!existingProblem) {
            return NextResponse.json({ success: false, error: 'Problem not found' }, { status: 404 });
        }

        const generatedProblem: GeneratedProblem = {
            problem,
            answer,
        };

        existingProblem.generatedProblems.push(JSON.stringify(generatedProblem));
        await existingProblem.save();

        return NextResponse.json({ success: true, data: existingProblem }, { status: 200 });
    } catch (error) {
        console.error('Error adding generated problem:', error);
        return NextResponse.json({ success: false, error: 'Error adding generated problem' }, { status: 500 });
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