import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import SentenceContainer from './SentenceContainer';
import axios from 'axios';

const ProblemContainer = () => {
    const [problemInput, setProblemInput] = useState('');
    const [problemData, setProblemData] = useState(null);
    const [originalSentence, setOriginalSentence] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (event) => {
        setProblemInput(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            const requestData = { prompt: problemInput };
            const response = await axios.post('/api/transform', requestData);

            setProblemData(response.data);
            setOriginalSentence(problemInput);
        } catch (error) {
            console.error('Error fetching problem data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = () => {
        setProblemData(null);
        setOriginalSentence('');
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '100%', margin: 'auto' }}>
            <Typography variant="h5" sx={{ marginBottom: '20px' }}>
                Enter Math Problem:
            </Typography>
            <TextField
                fullWidth
                variant="outlined"
                label="Math Problem"
                value={problemInput}
                onChange={handleInputChange}
                sx={{ marginBottom: '20px' }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isLoading}
            >
                {isLoading ? 'Loading...' : 'Submit'}
            </Button>
            {isLoading && (
                <CircularProgress size={24} sx={{ marginLeft: '10px' }} />
            )}
            {problemData && (
                <SentenceContainer
                    originalSentence={originalSentence}
                    sentence={problemData.problem}
                    answer={problemData.answer}
                    variables={problemData.variables}
                    onReject={handleReject}
                />
            )}
        </Box>
    );
};

export default ProblemContainer;