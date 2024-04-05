// /models/Problem.ts
import mongoose, { Document } from 'mongoose';

export interface ProblemDocument extends Document {
    problemId: string;
    originalProblem: string;
    generalizedProblem: string;
    generatedProblems: string[];
    variables: [string, string][];
    grade: number;
    topic: string;
    answer: string;
}

const ProblemSchema = new mongoose.Schema({
    problemId: {
        type: String,
        unique: true,
        required: true,
    },
    originalProblem: String,
    generalizedProblem: String,
    generatedProblems: [String],
    variables: [[String, String]],
    grade: Number,
    topic: String,
    answer: String,
});

export default mongoose.models.Problem || mongoose.model<ProblemDocument>('Problem', ProblemSchema, 'problems');