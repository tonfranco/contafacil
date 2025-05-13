import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Print as PrintIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useAppContext } from '../../context/AppContext';
import { FinancialReport } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const Reports: React.FC = () => {
  const { financialReports, transactions } = useAppContext();
  const [tabValue, setTabValue] = useState(0);
  const [selectedReport, setSelectedReport] = useState<FinancialReport | null>(
    financialReports.length > 0 ? financialReports[0] : null
  );
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(
    selectedReport ? new Date(selectedReport.startDate) : new Date()
  );
  const [endDate, setEndDate] = useState<Date | null>(
    selectedReport ? new Date(selectedReport.endDate) : new Date()
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleReportChange = (event: React.ChangeEvent<HTMLInputElement> | any) => {
    const reportId = event.target.value as string;
    const report = financialReports.find(r => r.id === reportId) || null;
    setSelectedReport(report);
    if (report) {
      setStartDate(new Date(report.startDate));
      setEndDate(new Date(report.endDate));
    }
  };

  const handleOpenDateRange = () => {
    setDateRangeOpen(true);
  };

  const handleCloseDateRange = () => {
    setDateRangeOpen(false);
  };

  const handleApplyDateRange = () => {
    // In a real app, this would fetch new data based on the date range
    handleCloseDateRange();
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Prepare data for Income Statement (DRE)
  const renderIncomeStatement = () => {
    if (!selectedReport || selectedReport.type !== 'INCOME_STATEMENT') return null;

    const { data } = selectedReport;
    const { income, expenses, netIncome } = data;

    // Prepare chart data
    const incomeChartData = Object.entries(income.categories).map(([name, value]) => ({
      name,
      value,
    }));

    const expenseChartData = Object.entries(expenses.categories).map(([name, value]) => ({
      name,
      value,
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    return (
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Demonstração de Resultado do Exercício (DRE)
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Período: {new Date(selectedReport.startDate).toLocaleDateString('pt-BR')} a {new Date(selectedReport.endDate).toLocaleDateString('pt-BR')}
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Receitas
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(income.categories).map(([category, value]) => (
                      <TableRow key={category}>
                        <TableCell>{category}</TableCell>
                        <TableCell align="right">{formatCurrency(value as number)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell>
                        <Typography fontWeight="bold">Total de Receitas</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold">{formatCurrency(income.total)}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Despesas
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(expenses.categories).map(([category, value]) => (
                      <TableRow key={category}>
                        <TableCell>{category}</TableCell>
                        <TableCell align="right">{formatCurrency(value as number)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell>
                        <Typography fontWeight="bold">Total de Despesas</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold">{formatCurrency(expenses.total)}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Resultado Líquido
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          color={netIncome >= 0 ? 'success.main' : 'error.main'}
                        >
                          {formatCurrency(netIncome)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Composição das Receitas
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incomeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Composição das Despesas
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };

  // Prepare data for Balance Sheet
  const renderBalanceSheet = () => {
    if (!selectedReport || selectedReport.type !== 'BALANCE_SHEET') return null;

    const { data } = selectedReport;
    const { assets, liabilities, equity } = data;

    return (
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Balanço Patrimonial
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Data: {new Date(selectedReport.endDate).toLocaleDateString('pt-BR')}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell colSpan={2}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              Ativos
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(assets.categories).map(([category, value]) => (
                          <TableRow key={category}>
                            <TableCell>{category}</TableCell>
                            <TableCell align="right">{formatCurrency(value as number)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell>
                            <Typography fontWeight="bold">Total de Ativos</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight="bold">{formatCurrency(assets.total)}</Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell colSpan={2}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              Passivos
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(liabilities.categories).map(([category, value]) => (
                          <TableRow key={category}>
                            <TableCell>{category}</TableCell>
                            <TableCell align="right">{formatCurrency(value as number)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell>
                            <Typography fontWeight="bold">Total de Passivos</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight="bold">{formatCurrency(liabilities.total)}</Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography variant="subtitle1" fontWeight="bold">
                              Patrimônio Líquido
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle1" fontWeight="bold">
                              {formatCurrency(equity)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Composição do Patrimônio
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: 'Ativos', value: assets.total },
                    { name: 'Passivos', value: liabilities.total },
                    { name: 'Patrimônio Líquido', value: equity },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };

  // Render cash flow report (placeholder)
  const renderCashFlow = () => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Fluxo de Caixa
        </Typography>
        <Typography variant="body1">
          Esta funcionalidade será implementada em breve.
        </Typography>
      </Box>
    );
  };

  return (
    <Box>
      <PageHeader
        title="Relatórios Financeiros"
        subtitle="Visualize e analise seus relatórios financeiros"
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<DateRangeIcon />}
              onClick={handleOpenDateRange}
            >
              Período
            </Button>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={() => window.print()}
            >
              Imprimir
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
            >
              Exportar
            </Button>
          </Box>
        }
      />

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="report tabs">
            <Tab label="DRE" id="report-tab-0" aria-controls="report-tabpanel-0" />
            <Tab label="Balanço Patrimonial" id="report-tab-1" aria-controls="report-tabpanel-1" />
            <Tab label="Fluxo de Caixa" id="report-tab-2" aria-controls="report-tabpanel-2" />
          </Tabs>
        </Box>

        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="report-select-label">Selecionar Relatório</InputLabel>
            <Select
              labelId="report-select-label"
              id="report-select"
              value={selectedReport?.id || ''}
              onChange={handleReportChange}
              label="Selecionar Relatório"
            >
              {financialReports
                .filter(report => {
                  if (tabValue === 0) return report.type === 'INCOME_STATEMENT';
                  if (tabValue === 1) return report.type === 'BALANCE_SHEET';
                  if (tabValue === 2) return report.type === 'CASH_FLOW';
                  return true;
                })
                .map(report => (
                  <MenuItem key={report.id} value={report.id}>
                    {report.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {renderIncomeStatement()}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {renderBalanceSheet()}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {renderCashFlow()}
        </TabPanel>
      </Paper>

      {/* Date Range Dialog */}
      <Dialog open={dateRangeOpen} onClose={handleCloseDateRange} maxWidth="xs" fullWidth>
        <DialogTitle>Selecionar Período</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Data Inicial"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                  },
                }}
              />
              <DatePicker
                label="Data Final"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDateRange}>Cancelar</Button>
          <Button onClick={handleApplyDateRange} variant="contained">
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reports;
