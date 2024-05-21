// /app/api/problem/[problemId]/generated/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Problem, { ProblemDocument } from '@/models/Problem';

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

        existingProblem.generatedProblems.push(generatedProblem);

        await existingProblem.save();

        return NextResponse.json({ success: true, data: existingProblem }, { status: 200 });
    } catch (error) {
        console.error('Error adding generated problem:', error);
        return NextResponse.json({ success: false, error: 'Error adding generated problem' }, { status: 500 });
    }
}


export async function GET(request: Request, { params }: { params: { problemId: string } }) {
    const { problemId } = params;

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    try {
        const existingProblem: ProblemDocument | null = await Problem.findOne({ problemId });

        if (!existingProblem) {
            return NextResponse.json({ success: false, error: 'Problem not found' }, { status: 404 });
        }

        const totalGeneratedProblems = existingProblem.generatedProblems.length;

        const generatedProblems = existingProblem.generatedProblems
            .filter((problem) => {
                const lowercaseSearch = search.toLowerCase();
                return (
                    problem.problem.toLowerCase().includes(lowercaseSearch) ||
                    problem.answer.toLowerCase().includes(lowercaseSearch)
                );
            })
            .slice(startIndex, endIndex);

        const pagination = {
            currentPage: page,
            totalPages: Math.ceil(totalGeneratedProblems / limit),
            totalGeneratedProblems,
        };

        console.log('Generated Problems:', generatedProblems, 'Pagination:', pagination);

        return NextResponse.json({ success: true, data: generatedProblems, pagination }, { status: 200 });
    } catch (error) {
        console.error('Error fetching generated problems:', error);
        return NextResponse.json({ success: false, error: 'Error fetching generated problems' }, { status: 500 });
    }
}
export async function PUT(request: Request) {
    return NextResponse.json({ message: 'PUT method not implemented' }, { status: 405 });
}

export async function DELETE(request: Request) {
    return NextResponse.json({ message: 'DELETE method not implemented' }, { status: 405 });
}