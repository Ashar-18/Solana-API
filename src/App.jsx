import { useState } from "react";
import { 
    BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { TextField, Button, CircularProgress, Container, Typography, Box } from "@mui/material";
import './index.css';

const SolanaTransactions = () => {
    const [mint, setMint] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTransactions = async () => {
        if (!mint) return;
        setLoading(true);
        try {
            const response = await fetch(`https://solanatransactionss-8ada5d60a902.herokuapp.com/transactions?mint=${mint}`);
            const result = await response.json();
            const formattedData = Object.keys(result).map(hour => ({
                hour,
                count: result[hour]
            }));
            setData(formattedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mainCont">
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "gray" }}>
                Solana Transaction Stats
            </Typography>
            <TextField
                label="Enter Mint Address"
                variant="outlined"
                fullWidth
                value={mint}
                onChange={(e) => setMint(e.target.value)}
                sx={{ width: "50%", marginTop: "40px" }}
            />
            <br />
            <Button 
                variant="contained" 
                color="primary" 
                onClick={fetchTransactions} 
                disabled={loading} 
                sx={{ width: "20%", marginTop: "20px" }}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Fetch Data"}
            </Button>

            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "gray", marginTop: "100px" }}>
                Graphical Representation
            </Typography>
            
            <Box className="result">
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                        <XAxis 
                            dataKey="hour" 
                            angle={-45} 
                            textAnchor="end" 
                            interval={Math.ceil(data.length / 10)} 
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#1976d2" />
                    </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300} sx={{ mt: 3 }}>
                 <PieChart>
                     <Pie data={data} dataKey="count" nameKey="hour" cx="50%" cy="50%" outerRadius={100}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                        ))}
                     </Pie>
                     <Tooltip />
                 </PieChart>
             </ResponsiveContainer>
            </Box>

            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "gray", marginTop: "100px" }}>
                Transaction Data (Plain Text)
            </Typography>

            <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: "auto" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Hour</b></TableCell>
                            <TableCell><b>Transaction Count</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.hour}</TableCell>
                                <TableCell>{row.count}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default SolanaTransactions;
