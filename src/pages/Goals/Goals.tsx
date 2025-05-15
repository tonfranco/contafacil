import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAppContext } from '../../context/AppContext';
import { FinancialGoal } from '../../types';
import PageHeader from '../../components/common/PageHeader';

const validationSchema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  targetAmount: yup.number().positive('Valor alvo deve ser positivo').required('Valor alvo é obrigatório'),
  currentAmount: yup.number().min(0, 'Valor atual deve ser maior ou igual a zero').required('Valor atual é obrigatório'),
  deadline: yup.date().required('Prazo é obrigatório'),
  priority: yup.string().oneOf(['LOW', 'MEDIUM', 'HIGH']).required('Prioridade é obrigatória'),
});

const Goals: React.FC = () => {
  const { financialGoals, addFinancialGoal, updateFinancialGoal, deleteFinancialGoal } = useAppContext();
  const [open, setOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingGoal(null);
    formik.resetForm();
  };

  const handleEdit = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    formik.setValues({
      ...goal,
      deadline: new Date(goal.deadline),
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta meta?')) {
      deleteFinancialGoal(id);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      deadline: new Date(),
      priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    },
    validationSchema,
    onSubmit: (values) => {
      const goalData = {
        ...values,
        deadline: values.deadline.toISOString().split('T')[0],
      };

      if (editingGoal) {
        updateFinancialGoal({
          ...goalData,
          id: editingGoal.id,
        });
      } else {
        addFinancialGoal(goalData);
      }

      handleClose();
    },
  });

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'error.main';
      case 'MEDIUM':
        return 'warning.main';
      case 'LOW':
        return 'info.main';
      default:
        return 'info.main';
    }
  };

  // Get priority label
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'Alta';
      case 'MEDIUM':
        return 'Média';
      case 'LOW':
        return 'Baixa';
      default:
        return priority;
    }
  };

  // Calculate days left until deadline
  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Box>
      <PageHeader
        title="Metas Financeiras"
        subtitle="Acompanhe e gerencie suas metas financeiras"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Nova Meta
          </Button>
        }
      />

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {financialGoals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const daysLeft = getDaysLeft(goal.deadline);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={goal.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      {goal.name}
                    </Typography>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: getPriorityColor(goal.priority),
                        bgcolor: `${getPriorityColor(goal.priority)}15`,
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      <FlagIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="caption">
                        {getPriorityLabel(goal.priority)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Progresso
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min(progress, 100)} 
                          sx={{ height: 8, borderRadius: 5 }}
                          color={progress >= 100 ? 'success' : 'primary'}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {progress.toFixed(0)}%
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Prazo
                    </Typography>
                    <Typography variant="body1">
                      {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color={daysLeft < 0 ? 'error.main' : daysLeft < 30 ? 'warning.main' : 'text.secondary'}
                    >
                      {daysLeft < 0 
                        ? `${Math.abs(daysLeft)} dias atrasado` 
                        : daysLeft === 0 
                          ? 'Hoje é o prazo final' 
                          : `${daysLeft} dias restantes`}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(goal)}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="small" 
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(goal.id)}
                  >
                    Excluir
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {editingGoal ? 'Editar Meta' : 'Nova Meta'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Nome da Meta"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="targetAmount"
                  name="targetAmount"
                  label="Valor Alvo"
                  type="number"
                  value={formik.values.targetAmount}
                  onChange={formik.handleChange}
                  error={formik.touched.targetAmount && Boolean(formik.errors.targetAmount)}
                  helperText={formik.touched.targetAmount && formik.errors.targetAmount}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="currentAmount"
                  name="currentAmount"
                  label="Valor Atual"
                  type="number"
                  value={formik.values.currentAmount}
                  onChange={formik.handleChange}
                  error={formik.touched.currentAmount && Boolean(formik.errors.currentAmount)}
                  helperText={formik.touched.currentAmount && formik.errors.currentAmount}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Prazo"
                    value={formik.values.deadline}
                    onChange={(newValue) => {
                      formik.setFieldValue('deadline', newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        error: formik.touched.deadline && Boolean(formik.errors.deadline),
                        helperText: formik.touched.deadline && (formik.errors.deadline ? String(formik.errors.deadline) : undefined),
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="priority-label">Prioridade</InputLabel>
                  <Select
                    labelId="priority-label"
                    id="priority"
                    name="priority"
                    value={formik.values.priority}
                    onChange={formik.handleChange}
                    error={formik.touched.priority && Boolean(formik.errors.priority)}
                    label="Prioridade"
                  >
                    <MenuItem value="LOW">Baixa</MenuItem>
                    <MenuItem value="MEDIUM">Média</MenuItem>
                    <MenuItem value="HIGH">Alta</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingGoal ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Goals;
