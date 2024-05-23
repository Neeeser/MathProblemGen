import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '@/lib/dbConnect';
import Grade, { GradeDocument, TopicDocument, SubtopicDocument, QuestionTypeDocument} from '@/models/Grade';
import Problem, {ProblemDocument} from '@/models/Problem';

export async function POST(request: Request, { params }: { params: { grade: string, topic: string, subTopic: string, questionType: string } }) {
    await dbConnect();
    const { grade, topic, subTopic, questionType } = params;
    const { originalProblem, generalizedProblem, variables, answer } = await request.json();

    try {
        // Find the grade or create a new one if it doesn't exist
        let gradeDoc = await Grade.findOne({ grade });
        if (!gradeDoc) {
            gradeDoc = new Grade({ grade, topics: [] });
        }

        // Find the topic or create a new one if it doesn't exist
        let topicDoc = gradeDoc.topics.find((t: TopicDocument) => t.topic === topic);
        if (!topicDoc) {
            topicDoc = { topic, subTopics: [] };
            gradeDoc.topics.push(topicDoc);

        }

        // Find the subtopic or create a new one if it doesn't exist
        let subtopicDoc = topicDoc.subTopics.find((s: SubtopicDocument) => s.subTopic === subTopic);
        if (!subtopicDoc) {
            subtopicDoc = { subTopic, questionTypes: [] };
            gradeDoc.topics.find((t: TopicDocument) => t.topic === topic).subTopics.push(subtopicDoc);
        }

        // Find the question type or create a new one if it doesn't exist
        let questionTypeDoc = subtopicDoc.questionTypes.find((q: QuestionTypeDocument) => q.questionType === questionType);
        if (!questionTypeDoc) {
            questionTypeDoc = { questionType, problems: [] };
            gradeDoc.topics.find((t: TopicDocument) => t.topic === topic).subTopics.find((s: SubtopicDocument) => s.subTopic === subTopic).questionTypes.push(questionTypeDoc);
        }

        // Create a new problem document
        const problemDoc: ProblemDocument = new Problem({
            problemId: uuidv4(),
            originalProblem,
            generalizedProblem,
            generatedProblems: [],
            variables,
            answer,
            problemLoc: {
                "grade": grade,
                "topic": topic,
                "subTopic": subTopic,
                "questionType": questionType,
            },
        });

        //await problemDoc.save();

        // Add the problem to the question type
        gradeDoc.topics.find((t: TopicDocument) => t.topic === topic).subTopics.find((s: SubtopicDocument) => s.subTopic === subTopic).questionTypes.find((q: QuestionTypeDocument) => q.questionType === questionType).problems.push(problemDoc);
        console.log(gradeDoc);
        // Save the changes
        await gradeDoc.save();

        return NextResponse.json({success: true, data: problemDoc }, { status: 201 });
    } catch (error) {
        console.error('Error saving to grades:', error);
        return NextResponse.json({ error: 'An error occurred while saving to grades' }, { status: 500 });
    }
}

