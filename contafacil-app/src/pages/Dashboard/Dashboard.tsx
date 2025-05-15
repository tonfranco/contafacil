import React, { useState } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
  SelectChangeEvent
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Savings as SavingsIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  MoreVert as MoreVertIcon,
  CalendarToday as CalendarTodayIcon,
  FilterList as FilterListIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import DashboardCard from '../../components/common/DashboardCard';
import PageHeader from '../../components/common/PageHeader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

// Interface para TabPanel
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Componente TabPanel
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Componente para card interativo com tendência
interface TrendCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  trendLabel?: string;
  bgGradient?: string;
}

const TrendCard: React.FC<TrendCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  trend, 
  trendLabel,
  bgGradient 
}) => {
  return (
    <Card sx={{ 
      borderRadius: 3, 
      boxShadow: 3,
      background: bgGradient || color,
      color: '#fff',
      transition: 'all 0.3s',
      height: '100%',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: 6
      }
    }}>
      <CardContent sx={{ p: 3, pb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
              {value}
            </Typography>
            {trend !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                {trend >= 0 ? (
                  <ArrowUpwardIcon fontSize="small" sx={{ color: '#A5D6A7' }} />
                ) : (
                  <ArrowDownwardIcon fontSize="small" sx={{ color: '#EF9A9A' }} />
                )}
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {Math.abs(trend).toFixed(1)}% {trendLabel || ''}
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ p: 1 }}>
            <Box sx={{ fontSize: '2.5rem' }}>
              {icon}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);
  const [period, setPeriod] = useState('month');
  const [chartView, setChartView] = useState('bar');
  const [tableTab, setTableTab] = useState(0);

  const { 
    transactions, 
    accounts, 
    budget, 
    financialGoals,
    monthlyData
  } = useAppContext();

  // Calculate total income, expenses, and balance
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME' && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'EXPENSE' && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Get recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Expense by category data for pie chart
  const expensesByCategory = transactions
    .filter(t => t.type === 'EXPENSE' && t.status === 'COMPLETED')
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieChartData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Budget progress
  const totalBudgeted = budget.categories.reduce((sum, cat) => sum + cat.planned, 0);
  const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.actual, 0);
  const budgetProgress = (totalSpent / totalBudgeted) * 100;

  // Dados para o gráfico de tendência
  const trendData = monthlyData.map(item => ({
    name: item.month,
    saldo: item.receitas - item.despesas
  }));

  // Handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handlePeriodChange = (event: SelectChangeEvent) => {
    setPeriod(event.target.value);
  };

  const handleChartViewChange = (event: SelectChangeEvent) => {
    setChartView(event.target.value);
  };

  const handleTableTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTableTab(newValue);
  };

  return (
    <Box sx={{ 
      pb: 4,
      background: 'linear-gradient(to right bottom, #f8f9fa, #e9ecef)',
      borderRadius: 2,
      p: 3,
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
    }}>
      {/* Cabeçalho com título e filtros */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            variant="outlined" 
            startIcon={<CalendarTodayIcon />}
            sx={{ mr: 1, borderRadius: 2 }}
          >
            Maio 2025
          </Button>
          <IconButton color="primary" sx={{ mr: 1 }}>
            <FilterListIcon />
          </IconButton>
          <IconButton color="primary">
            <NotificationsIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Abas de navegação */}
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        variant={isMobile ? "scrollable" : "standard"}
        scrollButtons={isMobile ? "auto" : undefined}
      >
        <Tab label="Visão Geral" />
        <Tab label="Despesas" />
        <Tab label="Receitas" />
        <Tab label="Metas" />
      </Tabs>

      {/* Conteúdo da aba Visão Geral */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={7}>
        
          {/* Linha 1: Cards de resumo com tendências */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={6} lg={4} sx={{ mb: 3 }}>
                <TrendCard
                  title="Saldo Total"
                  value={formatCurrency(balance)}
                  icon={<AccountBalanceIcon fontSize="large" />}
                  color={balance >= 0 ? 'success.main' : 'error.main'}
                  bgGradient={balance >= 0 
                    ? 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)' 
                    : 'linear-gradient(45deg, #f44336 30%, #e57373 90%)'}
                  trend={142.4}
                  trendLabel="vs mês anterior"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} sx={{ mb: 3 }}>
                <TrendCard
                  title="Receitas"
                  value={formatCurrency(totalIncome)}
                  icon={<TrendingUpIcon fontSize="large" />}
                  color="success.main"
                  bgGradient="linear-gradient(45deg, #4CAF50 30%, #81C784 90%)"
                  trend={5.2}
                  trendLabel="vs mês anterior"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} sx={{ mb: 3 }}>
                <TrendCard
                  title="Despesas"
                  value={formatCurrency(totalExpenses)}
                  icon={<TrendingDownIcon fontSize="large" />}
                  color="error.main"
                  bgGradient="linear-gradient(45deg, #f44336 30%, #e57373 90%)"
                  trend={-3.1}
                  trendLabel="vs mês anterior"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} sx={{ mb: 3 }}>
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: 3,
                  background: budgetProgress > 90 
                    ? 'linear-gradient(45deg, #f44336 30%, #e57373 90%)'
                    : budgetProgress > 70 
                      ? 'linear-gradient(45deg, #FF9800 30%, #FFCC80 90%)'
                      : 'linear-gradient(45deg, #2196F3 30%, #64B5F6 90%)',
                  color: '#fff',
                  transition: 'all 0.3s',
                  height: '100%',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}>
                  <CardContent sx={{ p: 3, pb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                          Orçamento Utilizado
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                          {budgetProgress.toFixed(0)}%
                        </Typography>
                      </Box>
                      <Box sx={{ p: 1 }}>
                        <Box sx={{ fontSize: '2.5rem' }}>
                          <SavingsIcon fontSize="large" />
                        </Box>
                      </Box>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={budgetProgress} 
                      sx={{ 
                        mt: 2, 
                        height: 10, 
                        borderRadius: 5,
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#fff'
                        }
                      }} 
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} sx={{ mb: 3 }}>
                <TrendCard
                  title="Saldo projetado próximo mês"
                  value={formatCurrency(balance)}
                  icon={<AccountBalanceIcon fontSize="large" />}
                  color={balance >= 0 ? 'success.main' : 'error.main'}
                  bgGradient={balance >= 0 
                    ? 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)' 
                    : 'linear-gradient(45deg, #f44336 30%, #e57373 90%)'}
                  trend={8.2}
                  trendLabel="vs mês anterior"
                />
              </Grid>

          </Grid>
        </Grid>
        
        {/* Linha 2: Tabelas lado a lado */}
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {/* Tabela de Transações Recentes */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="medium" color="text.primary">Transações Recentes</Typography>
                  <Button variant="contained" size="small" href="/transactions" color="primary" sx={{ borderRadius: 2 }}>
                    Ver todas
                  </Button>
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Data</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Categoria</TableCell>
                        <TableCell align="right">Valor</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentTransactions.map((transaction) => (
                        <TableRow 
                          key={transaction.id}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                              cursor: 'pointer'
                            }
                          }}
                        >
                          <TableCell>{new Date(transaction.date).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>{transaction.category}</TableCell>
                          <TableCell align="right" sx={{ 
                            color: transaction.type === 'INCOME' ? 'success.main' : 'error.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                          }}>
                            {transaction.type === 'INCOME' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Tabela de Metas Financeiras */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="medium" color="text.primary">Metas Financeiras</Typography>
                  <Button variant="contained" size="small" href="/goals" color="primary" sx={{ borderRadius: 2 }}>
                    Ver todas
                  </Button>
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Meta</TableCell>
                        <TableCell>Prazo</TableCell>
                        <TableCell>Progresso</TableCell>
                        <TableCell align="right">Valor</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {financialGoals.map((goal) => {
                        const progress = (goal.currentAmount / goal.targetAmount) * 100;
                        return (
                          <TableRow 
                            key={goal.id}
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                cursor: 'pointer'
                              }
                            }}
                          >
                            <TableCell>{goal.name}</TableCell>
                            <TableCell>{new Date(goal.deadline).toLocaleDateString('pt-BR')}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '100%', mr: 1 }}>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={progress} 
                                    sx={{ 
                                      height: 8, 
                                      borderRadius: 5,
                                      backgroundColor: 'rgba(0,0,0,0.1)',
                                      '& .MuiLinearProgress-bar': {
                                        backgroundColor: progress > 90 ? 'success.main' : progress > 50 ? 'info.main' : 'warning.main'
                                      }
                                    }} 
                                  />
                                </Box>
                                <Box sx={{ minWidth: 35 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {`${Math.round(progress)}%`}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Linha 3: Gráficos lado a lado */}
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {/* Gráfico de Receitas x Despesas */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Receitas x Despesas
                      Receitas x Despesas
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
                        <InputLabel id="period-select-label">Período</InputLabel>
                        <Select
                          labelId="period-select-label"
                          id="period-select"
                          value={period}
                          label="Período"
                          onChange={handlePeriodChange}
                        >
                          <MenuItem value="month">Mês</MenuItem>
                          <MenuItem value="quarter">Trimestre</MenuItem>
                          <MenuItem value="year">Ano</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel id="view-select-label">Visualização</InputLabel>
                        <Select
                          labelId="view-select-label"
                          id="view-select"
                          value={chartView}
                          label="Visualização"
                          onChange={handleChartViewChange}
                        >
                          <MenuItem value="bar">Barras</MenuItem>
                          <MenuItem value="line">Linhas</MenuItem>
                          <MenuItem value="area">Área</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                  
                  <Box sx={{ height: 350, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      {chartView === 'bar' ? (
                        <BarChart
                          data={monthlyData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 20,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <RechartsTooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend wrapperStyle={{ paddingTop: 15 }} />
                          <Bar dataKey="receitas" fill="#4caf50" name="Receitas" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="despesas" fill="#f44336" name="Despesas" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      ) : chartView === 'line' ? (
                        <LineChart
                          data={monthlyData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 20,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <RechartsTooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend wrapperStyle={{ paddingTop: 15 }} />
                          <Line type="monotone" dataKey="receitas" stroke="#4caf50" name="Receitas" strokeWidth={2} dot={{ r: 4 }} />
                          <Line type="monotone" dataKey="despesas" stroke="#f44336" name="Despesas" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                      ) : (
                        <AreaChart
                          data={monthlyData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 20,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <RechartsTooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend wrapperStyle={{ paddingTop: 15 }} />
                          <Area type="monotone" dataKey="receitas" fill="#4caf50" stroke="#4caf50" name="Receitas" fillOpacity={0.3} />
                          <Area type="monotone" dataKey="despesas" fill="#f44336" stroke="#f44336" name="Despesas" fillOpacity={0.3} />
                        </AreaChart>
                      )}
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              {/* Gráfico de Despesas por Categoria */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, height: '100%' }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Despesas por Categoria
                  </Typography>
                  <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={130}
                          fill="#8884d8"
                          dataKey="value"
                          animationDuration={1000}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend layout="vertical" verticalAlign="bottom" align="center" />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
        </Grid>

        </Grid>
      </TabPanel>

      {/* Conteúdo da aba Despesas */}
      <TabPanel value={activeTab} index={1}>
        <Typography variant="h6">Análise de Despesas</Typography>
        <Typography variant="body1">
          Conteúdo detalhado sobre despesas será exibido aqui.
        </Typography>
      </TabPanel>

      {/* Conteúdo da aba Receitas */}
      <TabPanel value={activeTab} index={2}>
        <Typography variant="h6">Análise de Receitas</Typography>
        <Typography variant="body1">
          Conteúdo detalhado sobre receitas será exibido aqui.
        </Typography>
      </TabPanel>

      {/* Conteúdo da aba Metas */}
      <TabPanel value={activeTab} index={3}>
        <Typography variant="h6">Acompanhamento de Metas</Typography>
        <Typography variant="body1">
          Conteúdo detalhado sobre metas financeiras será exibido aqui.
        </Typography>
      </TabPanel>
    </Box>
  );
};

export default Dashboard;
