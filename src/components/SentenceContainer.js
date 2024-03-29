import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import SentenceParser from './SentenceParser';

const SentenceContainer = ({ originalSentence, sentence, answer, variables }) => {
    const [open, setOpen] = useState(false);
    const [numProblems, setNumProblems] = useState(1);
    const [generatedProblems, setGeneratedProblems] = useState([]);

    const handleAccept = async () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleGenerate = async () => {
        try {
            const generatedProblems = [];

            for (let i = 0; i < numProblems; i++) {
                const response = await fetch('/api/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        problem: sentence,
                        answer: answer,
                        variables: variables,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    generatedProblems.push(data);
                } else {
                    console.error('Failed to generate problem');
                }
            }

            setGeneratedProblems(generatedProblems);
        } catch (error) {
            console.error('Error:', error);
        }

        setOpen(false);
    };

    return (
        <Box
            sx={{
                backgroundColor: 'white',
                padding: '20px',
                margin: '20px',
                maxWidth: '100%',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                borderRadius: '8px',
            }}
        >
            <Box sx={{ marginBottom: '10px' }}>
                <p>{originalSentence}</p>
            </Box>
            <SentenceParser sentence={sentence} />
            <div>{answer}</div>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '20px',
                    gap: '10px',
                }}
            >
                <Button variant="contained" color="success" onClick={handleAccept}>
                    Accept
                </Button>
                <Button variant="contained" color="error" onClick={() => console.log('Rejected')}>
                    Reject
                </Button>
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Generate Similar Problems</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Number of Problems"
                        type="number"
                        fullWidth
                        value={numProblems}
                        onChange={(e) => setNumProblems(parseInt(e.target.value))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleGenerate}>Generate</Button>
                </DialogActions>
            </Dialog>
            {generatedProblems.map((problem, index) => (
                <Box
                    key={index}
                    sx={{
                        backgroundColor: 'white',
                        padding: '20px',
                        margin: '20px',
                        maxWidth: '100%',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                    }}
                >
                    <p>{problem.generated_problem}</p>
                    <p>Answer: {problem.answer}</p>
                </Box>
            ))}
        </Box>
    );

};

export default SentenceContainer;