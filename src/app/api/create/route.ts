// src/app/api/generate-similar-problem/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI();

export async function POST(request: NextRequest) {
    const data = await request.json();
    console.log(data);

    try {
        const result = await generateSimilarProblem(data);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Failed to generate similar problem:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

async function generateSimilarProblem(parsedResult: any) {
    const problemTemplate = parsedResult.problem;
    const variables = parsedResult.variables;

    // Create a prompt for generating a similar problem
    let prompt = "Using the following problem template and variables, generate a similar math problem using random variables. Include the final answer to the problem like \nAnswer = x\n\n";
    prompt += `Template: ${problemTemplate}\n`;
    prompt += "Variables:\n";
    for (const [varName, varType] of variables) {
        prompt += `${varName}: ${varType}\n`;
    }
    prompt += "\nGenerated problem:";

    try {
        // Make the API request to generate a similar problem
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: 'You are a math problem generator.' },
                { role: 'user', content: prompt },
            ],
            temperature: 0.8, // Increased temperature for more variation
        });

        // Check if the response has the expected structure
        if (response.choices && response.choices.length > 0 && response.choices[0].message && response.choices[0].message.content) {
            const generatedProblem = response.choices[0].message.content.trim();

            // Extract the answer from the generated problem
            const [problem, answer] = generatedProblem.split('Answer = ');

            return {
                generated_problem: problem.trim(),
                answer: answer.trim(),
            };
        } else {
            throw new Error('Unexpected API response structure');
        }
    } catch (error) {
        console.error('Failed to generate similar problem:', error);
        throw error;
    }
}