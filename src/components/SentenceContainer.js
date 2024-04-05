import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import SentenceParser from './SentenceParser';

const SentenceContainer = ({ originalSentence, sentence, answer, variables }) => {
    const [open, setOpen] = useState(false);
    const [numProblems, setNumProblems] = useState(1);
    const [generatedProblems, setGeneratedProblems] = useState([]);
    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState('');
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [problemId, setProblemId] = useState(null);
    const [savedProblems, setSavedProblems] = useState([]);
    const [isAccepted, setIsAccepted] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isRejected, setIsRejected] = useState(false);

    const handleAccept = async () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSaveGeneratedProblem = async (problem, index) => {
        try {
            const response = await fetch(`/api/problem/${problemId}/generated`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    problem: problem.generated_problem,
                    answer: problem.answer,
                }),
            });

            if (response.ok) {
                console.log('Generated problem saved successfully');
                setSavedProblems([...savedProblems, index]);
            } else {
                console.error('Failed to save generated problem');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSaveAllGeneratedProblems = async () => {
        try {
            for (const [index, problem] of generatedProblems.entries()) {
                await handleSaveGeneratedProblem(problem, index);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const handleGenerate = async () => {
        setGeneratedProblems([]);
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

    const handleSaveProblem = async () => {
        console.log(originalSentence, sentence, variables, grade, topic, answer);

        try {
            const response = await fetch('/api/problem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    originalProblem: originalSentence,
                    generalizedProblem: sentence,
                    variables: variables,
                    grade: parseInt(grade.trim()),
                    topic: topic.trim(),
                    answer: answer,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const problemId = data.data.problemId;
                console.log('Problem saved successfully with ID:', problemId);
                setProblemId(problemId);
                setTopic('');
                setGrade('');
                setSaveDialogOpen(false);
            } else {
                console.error('Failed to save problem');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const openSaveDialog = () => {
        setSaveDialogOpen(true);
    };

    const closeSaveDialog = () => {
        setSaveDialogOpen(false);
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
                <Button variant="contained" color="primary" onClick={openSaveDialog}>
                    Save Problem
                </Button>
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
            <Dialog open={saveDialogOpen} onClose={closeSaveDialog}>
                <DialogTitle>Save Problem</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Topic"
                        type="text"
                        fullWidth
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Grade"
                        type="number"
                        fullWidth
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeSaveDialog}>Cancel</Button>
                    <Button onClick={handleSaveProblem}>Save</Button>
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
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSaveGeneratedProblem(problem, index)}
                        disabled={savedProblems.includes(index)}
                    >
                        {savedProblems.includes(index) ? 'Saved' : 'Save'}
                    </Button>
                </Box>
            ))}
            {generatedProblems.length > 0 && (
                <Button variant="contained" color="primary" onClick={handleSaveAllGeneratedProblems}>
                    Save All
                </Button>
            )}
        </Box>
    );
};


export default SentenceContainer;