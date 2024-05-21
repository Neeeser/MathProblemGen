// /models/Problem.ts

import mongoose, { Document } from 'mongoose';

export interface GeneratedProblem {
    problem: string;
    answer: string;
}

export interface ProblemDocument extends Document {
    problemId: string;
    originalProblem: string;
    generalizedProblem: string;
    generatedProblems: GeneratedProblem[];
    variables: [string, string][];
    answer: string;
    //problemLoc: [string, string, String, String],
    date: Date;
}

const ProblemSchema = new mongoose.Schema({
    problemId: {
        type: String,
        unique: true,
        required: true,
    },
    originalProblem: String,
    generalizedProblem: String,
    generatedProblems: [
        {
            problem: String,
            answer: String,
        },
    ],
    variables: [[String, String]],
    answer: String,
    //problemLoc: [String, String, String, String],
    date: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Problem || mongoose.model<ProblemDocument>('Problem', ProblemSchema, 'problems');