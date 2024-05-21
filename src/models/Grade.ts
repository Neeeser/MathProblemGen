// /models/Grade.ts

import mongoose, { Document } from 'mongoose';
import Problem, {ProblemDocument} from '../models/Problem';

export interface QuestionTypeDocument extends Document {
    questionType: string;
    problems: ProblemDocument[];
}

const QuestionTypeSchema = new mongoose.Schema({
    questionType: { type: String, required: true },
    problems: [Problem.schema],
});

export interface SubtopicDocument extends Document {
    subtopic: string;
    questionTypes: QuestionTypeDocument[];
}

const SubtopicSchema = new mongoose.Schema({
    subtopic: { type: String, required: true },
    questionTypes: [QuestionTypeSchema],
});

export interface TopicDocument extends Document {
    topic: string;
    subtopics: SubtopicDocument[];
}

const TopicSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    subtopics: [SubtopicSchema],
});

export interface GradeDocument extends Document {
    grade: number;
    topics: TopicDocument[];
}

const GradeSchema = new mongoose.Schema({
    grade: { type: Number, required: true },
    topics: [TopicSchema],
});

export default mongoose.models.Grade || mongoose.model<GradeDocument>('Grade', GradeSchema, 'grades');