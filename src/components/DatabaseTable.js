import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    Typography,
    Box,
    TextField,
    Link
} from '@mui/material';
import { Pagination } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useRouter } from 'next/navigation';

const DatabaseTable = () => {
    const [problems, setProblems] = useState([]);
    const [selectedFields, setSelectedFields] = useState(['originalProblem', 'generalizedProblem', 'answer', 'generatedProblems']);
    const [filterOpen, setFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const fetchProblems = async () => {
        try {
            const response = await fetch(`/api/grades?page=${currentPage}&limit=${pageSize}&search=${searchTerm}`);
            const data = await response.json();
            setProblems(data.data);
            setTotalPages(data.pagination.totalPages);
        } catch (error) {
            console.error('Error fetching problems:', error);
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
        fetchProblems();
    }, [currentPage, pageSize, searchTerm]);

    const handleFieldChange = (event) => {
        setSelectedFields(event.target.value);
    };

    const toggleFilter = () => {
        setFilterOpen(!filterOpen);
    };

    const handleGeneratedProblemsClick = (problemId) => {
        router.push(`/problems/${problemId}/generated`);
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '100%', margin: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <Typography variant="h4" sx={{ flexGrow: 1 }}>
                    Database Problems:
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
                <Select
                    multiple
                    open={filterOpen}
                    onClose={toggleFilter}
                    onOpen={toggleFilter}
                    value={selectedFields}
                    onChange={handleFieldChange}
                    renderValue={() => ''}
                    IconComponent={FilterListIcon}
                    sx={{ '& .MuiSelect-icon': { transform: 'none' } }}
                >
                    <MenuItem value="problemId">
                        <Checkbox checked={selectedFields.indexOf('problemId') > -1} />
                        <ListItemText primary="Problem ID" />
                    </MenuItem>
                    <MenuItem value="originalProblem">
                        <Checkbox checked={selectedFields.indexOf('originalProblem') > -1} />
                        <ListItemText primary="Original Problem" />
                    </MenuItem>
                    <MenuItem value="generalizedProblem">
                        <Checkbox checked={selectedFields.indexOf('generalizedProblem') > -1} />
                        <ListItemText primary="Generalized Problem" />
                    </MenuItem>
                    <MenuItem value="grade">
                        <Checkbox checked={selectedFields.indexOf('grade') > -1} />
                        <ListItemText primary="Grade" />
                    </MenuItem>
                    <MenuItem value="topic">
                        <Checkbox checked={selectedFields.indexOf('topic') > -1} />
                        <ListItemText primary="Topic" />
                    </MenuItem>
                    <MenuItem value="answer">
                        <Checkbox checked={selectedFields.indexOf('answer') > -1} />
                        <ListItemText primary="Answer" />
                    </MenuItem>
                    <MenuItem value="date">
                        <Checkbox checked={selectedFields.indexOf('date') > -1} />
                        <ListItemText primary="Date Created" />
                    </MenuItem>
                    <MenuItem value="generatedProblems">
                        <Checkbox checked={selectedFields.indexOf('generatedProblems') > -1} />
                        <ListItemText primary="Generated Problems" />
                    </MenuItem>
                </Select>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {selectedFields.map((field) => (
                                <TableCell key={field}>{field}</TableCell>
                            ))}
                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {problems.map((problem) => (
                            <TableRow key={problem.problemId}>
                                {selectedFields.map((field) => (
                                    <TableCell key={field}>
                                        {field === 'generatedProblems' ? (
                                            <Link
                                                component="button"
                                                variant="body2"
                                                onClick={() => handleGeneratedProblemsClick(problem.problemId)}
                                            >
                                                View Generated Problems
                                            </Link>
                                        ) : (
                                            problem[field]
                                        )}
                                    </TableCell>
                                ))}
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

export default DatabaseTable;