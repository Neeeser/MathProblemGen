// src/app/api/create/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const body = await request.json();

    console.log(body);
    try {
        const response = await fetch('http://127.0.0.1:5000/generate_similar_problem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            // If the response from the Flask API was not ok, return an error
            return new Response(JSON.stringify({ error: `Server responded with status code ${response.status}` }), {
                status: response.status,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const data = await response.json();

        // Return the data as a JSON response
        return new Response(JSON.stringify(data), {
            status: 200, // OK status
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Failed to fetch or parse JSON:", error);
        // Return an internal server error response
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}