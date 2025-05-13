import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAppContext } from '../../context/AppContext';
import { Budget as BudgetType, BudgetCategory } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';

const validationSchema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  startDate: yup.date().required('Data inicial é obrigatória'),
  endDate: yup.date().required('Data final é obrigatória'),
  categories: yup.array().of(
    yup.object({
      id: yup.string(),
      name: yup.string().required('Nome da categoria é obrigatório'),
      planned: yup.number().min(0, 'Valor planejado deve ser maior ou igual a zero').required('Valor planejado é obrigatório'),
      actual: yup.number().min(0, 'Valor atual deve ser maior ou igual a zero').required('Valor atual é obrigatório'),
    })
  ),
});

const Budget: React.FC = () => {
  const { budget, updateBudget } = useAppContext();
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenCategoryDialog = (category?: BudgetCategory) => {
    if (category) {
      setEditingCategory(category);
      categoryFormik.setValues(category);
    } else {
      setEditingCategory(null);
      categoryFormik.resetForm();
    }
    setCategoryDialogOpen(true);
  };

  const handleCloseCategoryDialog = () => {
    setCategoryDialogOpen(false);
    setEditingCategory(null);
    categoryFormik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      ...budget,
      startDate: new Date(budget.startDate),
      endDate: new Date(budget.endDate),
    },
    validationSchema,
    onSubmit: (values) => {
      const updatedBudget = {
        ...values,
        startDate: values.startDate.toISOString().split('T')[0],
        endDate: values.endDate.toISOString().split('T')[0],
      };
      updateBudget(updatedBudget);
      handleClose();
    },
  });

  const categoryFormik = useFormik({
    initialValues: {
      id: '',
      name: '',
      planned: 0,
      actual: 0,
    },
    validationSchema: yup.object({
      name: yup.string().required('Nome da categoria é obrigatório'),
      planned: yup.number().min(0, 'Valor planejado deve ser maior ou igual a zero').required('Valor planejado é obrigatório'),
      actual: yup.number().min(0, 'Valor atual deve ser maior ou igual a zero').required('Valor atual é obrigatório'),
    }),
    onSubmit: (values) => {
      const updatedCategories = [...formik.values.categories];
      
      if (editingCategory) {
        const index = updatedCategories.findIndex(cat => cat.id === editingCategory.id);
        if (index !== -1) {
          updatedCategories[index] = values;
        }
      } else {
        updatedCategories.push({
          ...values,
          id: Date.now().toString(),
        });
      }
      
      formik.setFieldValue('categories', updatedCategories);
      handleCloseCategoryDialog();
    },
  });

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      const updatedCategories = formik.values.categories.filter(cat => cat.id !== id);
      formik.setFieldValue('categories', updatedCategories);
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Calculate totals
  const totalPlanned = budget.categories.reduce((sum, cat) => sum + cat.planned, 0);
  const totalActual = budget.categories.reduce((sum, cat) => sum + cat.actual, 0);
  const totalPercentage = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0;

  // Prepare data for pie chart
  const pieChartData = budget.categories.map(cat => ({
    name: cat.name,
    planned: cat.planned,
    actual: cat.actual,
    percentage: cat.planned > 0 ? (cat.actual / cat.planned) * 100 : 0,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <Box>
      <PageHeader
        title="Orçamento"
        subtitle={`${new Date(budget.startDate).toLocaleDateString('pt-BR')} a ${new Date(budget.endDate).toLocaleDateString('pt-BR')}`}
        action={
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleClickOpen}
          >
            Editar Orçamento
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">{budget.name}</Typography>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Planejado: {formatCurrency(totalPlanned)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Atual: {formatCurrency(totalActual)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Progresso Geral</Typography>
                <Typography variant="body2">{totalPercentage.toFixed(0)}%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={Math.min(totalPercentage, 100)}
                sx={{ height: 10, borderRadius: 5 }}
                color={totalPercentage > 100 ? 'error' : 'primary'}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Categorias</Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleOpenCategoryDialog()}
                size="small"
              >
                Adicionar Categoria
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Categoria</TableCell>
                    <TableCell align="right">Planejado</TableCell>
                    <TableCell align="right">Atual</TableCell>
                    <TableCell align="right">%</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {budget.categories.map((category) => {
                    const percentage = category.planned > 0 ? (category.actual / category.planned) * 100 : 0;
                    return (
                      <TableRow key={category.id}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell align="right">{formatCurrency(category.planned)}</TableCell>
                        <TableCell align="right">{formatCurrency(category.actual)}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Box sx={{ width: 60, mr: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min(percentage, 100)}
                                color={percentage > 100 ? 'error' : 'primary'}
                              />
                            </Box>
                            {percentage.toFixed(0)}%
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box>
                            <Tooltip title="Editar">
                              <IconButton size="small" onClick={() => handleOpenCategoryDialog(category)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Excluir">
                              <IconButton size="small" onClick={() => handleDeleteCategory(category.id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Distribuição do Orçamento
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="planned"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Budget Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Editar Orçamento</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Nome"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Data Inicial"
                    value={formik.values.startDate}
                    onChange={(newValue) => {
                      formik.setFieldValue('startDate', newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        error: formik.touched.startDate && Boolean(formik.errors.startDate),
                        helperText: formik.touched.startDate && (formik.errors.startDate ? String(formik.errors.startDate) : undefined),
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Data Final"
                    value={formik.values.endDate}
                    onChange={(newValue) => {
                      formik.setFieldValue('endDate', newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        error: formik.touched.endDate && Boolean(formik.errors.endDate),
                        helperText: formik.touched.endDate && (formik.errors.endDate ? String(formik.errors.endDate) : undefined),
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Categorias</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenCategoryDialog()}
                    size="small"
                  >
                    Adicionar Categoria
                  </Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Categoria</TableCell>
                        <TableCell align="right">Planejado</TableCell>
                        <TableCell align="right">Atual</TableCell>
                        <TableCell align="right">Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formik.values.categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>{category.name}</TableCell>
                          <TableCell align="right">{formatCurrency(category.planned)}</TableCell>
                          <TableCell align="right">{formatCurrency(category.actual)}</TableCell>
                          <TableCell align="right">
                            <Box>
                              <Tooltip title="Editar">
                                <IconButton size="small" onClick={() => handleOpenCategoryDialog(category)}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Excluir">
                                <IconButton size="small" onClick={() => handleDeleteCategory(category.id)}>
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">
              Salvar
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Add/Edit Category Dialog */}
      <Dialog open={categoryDialogOpen} onClose={handleCloseCategoryDialog} maxWidth="sm" fullWidth>
        <form onSubmit={categoryFormik.handleSubmit}>
          <DialogTitle>
            {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Nome"
                  value={categoryFormik.values.name}
                  onChange={categoryFormik.handleChange}
                  error={categoryFormik.touched.name && Boolean(categoryFormik.errors.name)}
                  helperText={categoryFormik.touched.name && categoryFormik.errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="planned"
                  name="planned"
                  label="Valor Planejado"
                  type="number"
                  value={categoryFormik.values.planned}
                  onChange={categoryFormik.handleChange}
                  error={categoryFormik.touched.planned && Boolean(categoryFormik.errors.planned)}
                  helperText={categoryFormik.touched.planned && categoryFormik.errors.planned}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="actual"
                  name="actual"
                  label="Valor Atual"
                  type="number"
                  value={categoryFormik.values.actual}
                  onChange={categoryFormik.handleChange}
                  error={categoryFormik.touched.actual && Boolean(categoryFormik.errors.actual)}
                  helperText={categoryFormik.touched.actual && categoryFormik.errors.actual}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCategoryDialog}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingCategory ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Budget;
