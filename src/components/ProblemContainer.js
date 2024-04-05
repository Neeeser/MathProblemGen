// In components/ProblemContainer.js
import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import SentenceContainer from './SentenceContainer';
import axios from 'axios';

const ProblemContainer = () => {
    const [problemInput, setProblemInput] = useState('');
    const [problemData, setProblemData] = useState(null);

    const handleInputChange = (event) => {
        setProblemInput(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            // Here you would call the API endpoint
            const response = await axios.post('/api/transform', { prompt: problemInput });
            // Assuming the response structure is the one provided
            setProblemData(response.data);
        } catch (error) {
            console.error('Error fetching problem data:', error);
            // Handle errors as needed
        }
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
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
            </Button>
            {problemData && <SentenceContainer originalSentence={problemInput} sentence={problemData.problem} answer={problemData.answer} variables={problemData.variables} />}
        </Box>
    );
};

export default ProblemContainer;
