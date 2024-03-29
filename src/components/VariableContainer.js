// In components/VariableContainer.js
import React from 'react';
import { Box, Tooltip } from '@mui/material';

export const VariableContainer = ({ children, type }) => (
    <Tooltip title={type} placement="bottom" arrow>
        <Box
            sx={{
                backgroundColor: 'red',
                color: 'white',
                padding: '8px',
                borderRadius: '4px',
                margin: '4px',
                display: 'inline-flex', // Keeps the display as inline-flex
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                    opacity: 0.7,
                },
                cursor: 'pointer',
            }}
            onClick={() => console.log(`Variable clicked: ${children}`)}
        >
            {children}
        </Box>
    </Tooltip>
);
