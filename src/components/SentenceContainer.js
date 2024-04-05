import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress } from '@mui/material';
import SentenceParser from './SentenceParser';

const SentenceContainer = ({ originalSentence, sentence, answer, variables, onReject }) => {
    const [numProblems, setNumProblems] = useState(1);
    const [generatedProblems, setGeneratedProblems] = useState([]);
    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState('');
    const [problemId, setProblemId] = useState(null);
    const [savedProblems, setSavedProblems] = useState([]);
    const [saveAndGenerateDialogOpen, setSaveAndGenerateDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSavingIndividual, setIsSavingIndividual] = useState({}); // Tracks saving state of individual problems
    const [isSavingAll, setIsSavingAll] = useState(false);


    const openSaveAndGenerateDialog = () => {
        setSaveAndGenerateDialogOpen(true);
    };

    const closeSaveAndGenerateDialog = () => {
        setSaveAndGenerateDialogOpen(false);
    };

    const handleSaveGeneratedProblem = async (problem, index) => {
        try {
            setIsSavingIndividual(prev => ({...prev, [index]: true})); // Set saving state for this problem
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
                setSavedProblems(prev => [...prev, index]);
            } else {
                console.error('Failed to save generated problem');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsSavingIndividual(prev => ({...prev, [index]: false})); // Unset saving state for this problem
        }
    };

    const handleSaveAllGeneratedProblems = async () => {
        try {
            setIsSavingAll(true);
            const savingPromises = generatedProblems.map((problem, index) =>
                !savedProblems.includes(index) ? handleSaveGeneratedProblem(problem, index) : Promise.resolve()
            );
            await Promise.all(savingPromises);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsSavingAll(false);
        }
    };

    const handleSaveAndGenerate = async () => {
        try {
            setIsGenerating(true);
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
                setSaveAndGenerateDialogOpen(false);
            } else {
                console.error('Failed to save problem');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsGenerating(false);
        }
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
                <Button variant="contained" color="primary" onClick={openSaveAndGenerateDialog}>
                    Save and Generate
                </Button>
                <Button variant="contained" color="error" onClick={onReject}>
                    Reject
                </Button>
            </Box>
            <Dialog open={saveAndGenerateDialogOpen} onClose={closeSaveAndGenerateDialog}>
                <DialogTitle>Save and Generate Problems</DialogTitle>
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
                    <TextField
                        margin="dense"
                        label="Number of Problems"
                        type="number"
                        fullWidth
                        value={numProblems}
                        onChange={(e) => setNumProblems(parseInt(e.target.value))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeSaveAndGenerateDialog} disabled={isGenerating}>
                        Cancel
                    </Button>
                    <Button onClick={handleSaveAndGenerate} disabled={isGenerating}>
                        {isGenerating ? 'Generating...' : 'Save and Generate'}
                        {isGenerating && <CircularProgress size={20} sx={{ marginLeft: '10px' }} />}
                    </Button>
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
                    disabled={savedProblems.includes(index) || isSavingIndividual[index] || isSavingAll}
                >
                    {savedProblems.includes(index) ? 'Saved' : isSavingIndividual[index] ? 'Saving...' : 'Save'}
                    {isSavingIndividual[index] && <CircularProgress size={20} sx={{ marginLeft: '10px' }} />}
                </Button>
                </Box>
            ))}

            {generatedProblems.length > 0 && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveAllGeneratedProblems}
                    disabled={isSavingAll}
                >
                    {isSavingAll ? 'Saving All...' : 'Save All'}
                    {isSavingAll && <CircularProgress size={20} sx={{ marginLeft: '10px' }} />}
                </Button>
            )}
        </Box>
    );
};

export default SentenceContainer;