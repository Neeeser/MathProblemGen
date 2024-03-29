// In components/SentenceContainer.js
import React from 'react';
import { Box, Button } from '@mui/material';
import SentenceParser from './SentenceParser';

const SentenceContainer = ({ orignalsentence, sentence }) => {
    console.log(sentence)
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
                <p>{orignalsentence}</p>
            </Box>
            <SentenceParser sentence={sentence} />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '20px',
                    gap: '10px',
                }}
            >
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => console.log('Accepted')}
                >
                    Accept
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => console.log('Rejected')}
                >
                    Reject
                </Button>
            </Box>
        </Box>
    );
};

export default SentenceContainer;
