import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Chip,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAppContext } from '../../context/AppContext';
import { Transaction } from '../../types';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';

const validationSchema = yup.object({
  date: yup.date().required('Data é obrigatória'),
  description: yup.string().required('Descrição é obrigatória'),
  amount: yup.number().positive('Valor deve ser positivo').required('Valor é obrigatório'),
  type: yup.string().oneOf(['INCOME', 'EXPENSE', 'TRANSFER']).required('Tipo é obrigatório'),
  accountId: yup.string().required('Conta é obrigatória'),
  destinationAccountId: yup.string().when('type', {
    is: 'TRANSFER',
    then: (schema) => schema.required('Conta de destino é obrigatória'),
  }),
  category: yup.string().required('Categoria é obrigatória'),
  paymentMethod: yup.string(),
  status: yup.string().oneOf(['PENDING', 'COMPLETED', 'CANCELED']).required('Status é obrigatório'),
});

const Transactions: React.FC = () => {
  const { transactions, accounts, addTransaction, updateTransaction, deleteTransaction } = useAppContext();
  const [open, setOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTransaction(null);
    formik.resetForm();
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    formik.setValues({
      ...transaction,
      date: new Date(transaction.date),
      // Garantir que campos opcionais estejam definidos para o formulário
      destinationAccountId: transaction.destinationAccountId || '',
      paymentMethod: transaction.paymentMethod || '',
      tags: transaction.tags || [],
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteTransaction(id);
    }
  };

  const formik = useFormik({
    initialValues: {
      date: new Date(),
      description: '',
      amount: 0,
      type: 'EXPENSE' as 'INCOME' | 'EXPENSE' | 'TRANSFER',
      accountId: '',
      destinationAccountId: '',
      category: '',
      paymentMethod: '',
      tags: [] as string[],
      status: 'COMPLETED' as 'PENDING' | 'COMPLETED' | 'CANCELED',
    },
    validationSchema,
    onSubmit: (values) => {
      const transactionData = {
        ...values,
        date: values.date.toISOString().split('T')[0],
      };

      if (editingTransaction) {
        updateTransaction({
          ...transactionData,
          id: editingTransaction.id,
        });
      } else {
        addTransaction(transactionData);
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

  // Get all categories from transactions
  const categories = [...new Set(transactions.map((t) => t.category))];

  // Filter transactions based on type
  const filteredTransactions = filterType === 'ALL'
    ? transactions
    : transactions.filter((t) => t.type === filterType);

  // Define columns for the data table
  const columns = [
    {
      id: 'date',
      label: 'Data',
      minWidth: 100,
      format: (value: string) => new Date(value).toLocaleDateString('pt-BR'),
      sortable: true,
    },
    {
      id: 'description',
      label: 'Descrição',
      minWidth: 170,
      sortable: true,
    },
    {
      id: 'category',
      label: 'Categoria',
      minWidth: 130,
      sortable: true,
    },
    {
      id: 'type',
      label: 'Tipo',
      minWidth: 100,
      format: (value: string) => {
        const typeMap = {
          INCOME: { label: 'Receita', color: 'success.main', icon: <ArrowUpwardIcon fontSize="small" /> },
          EXPENSE: { label: 'Despesa', color: 'error.main', icon: <ArrowDownwardIcon fontSize="small" /> },
          TRANSFER: { label: 'Transferência', color: 'info.main', icon: null },
        };
        
        const type = typeMap[value as keyof typeof typeMap];
        
        // Verificar se o tipo existe para evitar erro
        if (!type) {
          return <Typography variant="body2">Desconhecido</Typography>;
        }
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', color: type.color }}>
            {type.icon}
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {type.label}
            </Typography>
          </Box>
        );
      },
      sortable: true,
    },
    {
      id: 'amount',
      label: 'Valor',
      minWidth: 120,
      align: "right" as "right",
      format: (value: number, row: Transaction) => {
        // Verificar se row existe e tem a propriedade type
        if (!row || !row.type) {
          return <Typography>{formatCurrency(value)}</Typography>;
        }
        const color = row.type === 'INCOME' ? 'success.main' : row.type === 'EXPENSE' ? 'error.main' : 'info.main';
        return <Typography sx={{ color }}>{formatCurrency(value)}</Typography>;
      },
      sortable: true,
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      format: (value: string) => {
        const statusMap = {
          PENDING: { label: 'Pendente', color: 'warning.main' },
          COMPLETED: { label: 'Concluído', color: 'success.main' },
          CANCELED: { label: 'Cancelado', color: 'error.main' },
        };
        
        const status = statusMap[value as keyof typeof statusMap];
        
        // Verificar se o status existe para evitar erro
        if (!status) {
          return <Chip label="Desconhecido" size="small" sx={{ backgroundColor: 'grey.500', color: 'white' }} />;
        }
        
        return (
          <Chip 
            label={status.label} 
            size="small" 
            sx={{ 
              backgroundColor: `${status.color}`,
              color: 'white',
            }} 
          />
        );
      },
      sortable: true,
    },
    {
      id: 'actions',
      label: 'Ações',
      minWidth: 100,
      format: (_: any, row: Transaction) => (
        <Box>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => handleEdit(row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton size="small" onClick={() => handleDelete(row.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // Get flat list of accounts for dropdown
  const getFlatAccounts = (accounts: any[], parentPath = '') => {
    let result: { id: string; name: string }[] = [];
    
    accounts.forEach(account => {
      const path = parentPath ? `${parentPath} > ${account.name}` : account.name;
      result.push({ id: account.id, name: path });
      
      if (account.children && account.children.length > 0) {
        result = [...result, ...getFlatAccounts(account.children, path)];
      }
    });
    
    return result;
  };
  
  const flatAccounts = getFlatAccounts(accounts);

  return (
    <Box>
      <PageHeader
        title="Transações"
        subtitle="Gerencie suas receitas e despesas"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Nova Transação
          </Button>
        }
      />

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl size="small" sx={{ width: 200 }}>
          <InputLabel id="filter-type-label">Filtrar por Tipo</InputLabel>
          <Select
            labelId="filter-type-label"
            id="filter-type"
            value={filterType}
            label="Filtrar por Tipo"
            onChange={(e) => setFilterType(e.target.value)}
            startAdornment={<FilterListIcon sx={{ mr: 1 }} />}
          >
            <MenuItem value="ALL">Todos</MenuItem>
            <MenuItem value="INCOME">Receitas</MenuItem>
            <MenuItem value="EXPENSE">Despesas</MenuItem>
            <MenuItem value="TRANSFER">Transferências</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <DataTable
        columns={columns}
        rows={filteredTransactions}
        title="Lista de Transações"
      />

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Data"
                    value={formik.values.date}
                    onChange={(newValue) => {
                      formik.setFieldValue('date', newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        error: formik.touched.date && Boolean(formik.errors.date),
                        helperText: formik.touched.date && (formik.errors.date ? String(formik.errors.date) : undefined),
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="type-label">Tipo</InputLabel>
                  <Select
                    labelId="type-label"
                    id="type"
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    error={formik.touched.type && Boolean(formik.errors.type)}
                    label="Tipo"
                  >
                    <MenuItem value="INCOME">Receita</MenuItem>
                    <MenuItem value="EXPENSE">Despesa</MenuItem>
                    <MenuItem value="TRANSFER">Transferência</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Descrição"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="amount"
                  name="amount"
                  label="Valor"
                  type="number"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  helperText={formik.touched.amount && formik.errors.amount}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    error={formik.touched.status && Boolean(formik.errors.status)}
                    label="Status"
                  >
                    <MenuItem value="PENDING">Pendente</MenuItem>
                    <MenuItem value="COMPLETED">Concluído</MenuItem>
                    <MenuItem value="CANCELED">Cancelado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="account-label">Conta</InputLabel>
                  <Select
                    labelId="account-label"
                    id="accountId"
                    name="accountId"
                    value={formik.values.accountId}
                    onChange={formik.handleChange}
                    error={formik.touched.accountId && Boolean(formik.errors.accountId)}
                    label="Conta"
                  >
                    {flatAccounts.map((account) => (
                      <MenuItem key={account.id} value={account.id}>
                        {account.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {formik.values.type === 'TRANSFER' && (
                <Grid item xs={12} sm={6} component="div">
                  <FormControl fullWidth>
                    <InputLabel id="destination-account-label">Conta de Destino</InputLabel>
                    <Select
                      labelId="destination-account-label"
                      id="destinationAccountId"
                      name="destinationAccountId"
                      value={formik.values.destinationAccountId}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.destinationAccountId &&
                        Boolean(formik.errors.destinationAccountId)
                      }
                      label="Conta de Destino"
                    >
                      {flatAccounts.map((account) => (
                        <MenuItem key={account.id} value={account.id}>
                          {account.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Categoria</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    error={formik.touched.category && Boolean(formik.errors.category)}
                    label="Categoria"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="paymentMethod"
                  name="paymentMethod"
                  label="Método de Pagamento"
                  value={formik.values.paymentMethod}
                  onChange={formik.handleChange}
                  error={formik.touched.paymentMethod && Boolean(formik.errors.paymentMethod)}
                  helperText={formik.touched.paymentMethod && formik.errors.paymentMethod}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingTransaction ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Transactions;
