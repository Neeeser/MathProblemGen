// src/app/api/transform/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI();

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { prompt } = body;
    console.log(prompt);

    const userPromptFile = fs.readFileSync(path.join(process.cwd(), 'src/app', 'prompts', 'user_prompt.txt'), 'utf-8');
    const sysPromptFile = fs.readFileSync(path.join(process.cwd(), 'src/app', 'prompts', 'sys_prompt_instruct.txt'), 'utf-8');

    const userPrompt = `${userPromptFile}\n${prompt}\nGeneralized Format: \n`;

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: sysPromptFile },
                { role: 'user', content: userPrompt },
            ],
            model: 'gpt-4',
            temperature: 0.1
        });

        const generatedOutput = completion.choices[0].message.content;
        const parsedOutput = parseLLMOutput(generatedOutput || ''); // Add null check

        return NextResponse.json(parsedOutput);
    } catch (error) {
        console.error('Failed to fetch or parse JSON:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

function parseLLMOutput(output: string) {
    // Split the output into lines
    const lines = output.trim().split('\n');

    // The first line is the problem statement
    const problemStatement = lines[0];

    // Prepare an object to store the parsed output
    const parsedOutput = {
        problem: problemStatement,
        variables: [] as Array<[string, string]>,
        answer: '',
    };

    // Iterate over the remaining lines to parse variables
    for (const line of lines.slice(1)) {
        if (line.toLowerCase().includes('answer')) {
            parsedOutput.answer = line.trim();
            continue;
        }

        // Assuming the line format is 'variable_name: variable_type'
        const parts = line.split(':');
        if (parts.length === 2) {
            const variableName = parts[0].trim();
            let variableType = parts[1].trim();

            // Validate and convert types (supports str, int, float)
            if (variableType === 'str') {
                variableType = 'str';
            } else if (variableType === 'int') {
                variableType = 'int';
            } else if (variableType === 'float') {
                variableType = 'float';
            } else {
                console.log(`Unsupported type: ${variableType}`);
                continue;
            }

            // Add the variable to the list
            parsedOutput.variables.push([variableName, variableType]);
        }
    }

    return parsedOutput;
}