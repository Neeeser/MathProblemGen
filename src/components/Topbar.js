// components/Topbar.js

import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Topbar = () => {
    return (
        <AppBar position="static" sx={{ backgroundColor: 'rgb(123, 40, 65)', boxShadow: 'none' }}>
            <Toolbar>
                <Typography variant="h7" component="div" sx={{ flexGrow: 1, color: '#ffffff' }}>
                    Math Problem Generator
                </Typography>
                <Button color="inherit" component={Link} href="/" sx={{ color: '#ffffff' }}>
                    Grade View
                </Button>
                <Button color="inherit" component={Link} href="/generator" sx={{ color: '#ffffff' }}>
                    Generate
                </Button>
                <Button color="inherit" component={Link} href="/database" sx={{ color: '#ffffff' }}>
                    Database
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;