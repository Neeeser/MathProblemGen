// In components/WordContainer.js
import React from 'react';
import { Box } from '@mui/material';

export const WordContainer = ({ children }) => (
    <Box
        sx={{
            backgroundColor: 'white',
            color: 'black',
            padding: '2px',
            borderRadius: '4px',
            margin: '4px',
            display: 'inline-flex', // Changed to inline-flex
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {
                opacity: .1,
            },
            cursor: 'pointer',
        }}
        onClick={() => console.log(`Word clicked: ${children}`)}
    >
        {children}
    </Box>
);