import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    TextField,
    Select,
    MenuItem
} from '@mui/material';
import { Pagination } from '@mui/material';
import { useParams } from 'next/navigation';
const GeneratedProblemsTable = () => {
    const [generatedProblems, setGeneratedProblems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const { problemId } = useParams();

    const fetchGeneratedProblems = async () => {
        try {
            const response = await fetch(`/api/grades/${problemId}/generated?page=${currentPage}&limit=${pageSize}&search=${searchTerm}`);
            const data = await response.json();
            setGeneratedProblems(data.data);
            setTotalPages(data.pagination.totalPages);
        } catch (error) {
            console.error('Error fetching generated problems:', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setCurrentPage(1);
    };

    useEffect(() => {
        if (problemId) {
            fetchGeneratedProblems();
        }
    }, [problemId, currentPage, pageSize, searchTerm]);

    return (
        <Box sx={{ padding: '20px', maxWidth: '100%', margin: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <Typography variant="h4" sx={{ flexGrow: 1 }}>
                    Generated Problems for Problem ID: {problemId}
                </Typography>
                <TextField
                    placeholder="Search..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ marginRight: '10px' }}
                />
                                <Select value={pageSize} onChange={handlePageSizeChange}>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                </Select>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Problem</TableCell>
                            <TableCell>Answer</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {generatedProblems.map((problem, index) => (
                            <TableRow key={index}>
                                <TableCell>{problem.problem}</TableCell>
                                <TableCell>{problem.answer}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
            />
        </Box>
    );
};

export default GeneratedProblemsTable;