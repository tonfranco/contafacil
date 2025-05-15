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
  IconButton,
  Tooltip,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AccountBalance as AccountBalanceIcon,
  CreditCard as CreditCardIcon,
  Savings as SavingsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAppContext } from '../../context/AppContext';
import { Account } from '../../types';
import PageHeader from '../../components/common/PageHeader';

const validationSchema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  type: yup.string().oneOf(['ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE']).required('Tipo é obrigatório'),
  parentId: yup.string(),
});

const Accounts: React.FC = () => {
  const { accounts, addAccount, updateAccount, deleteAccount } = useAppContext();
  const [open, setOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAccount(null);
    formik.resetForm();
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    formik.setValues({
      ...account,
      parentId: account.parentId || '',
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    // Check if account has children
    const hasChildren = accounts.some(account => account.parentId === id);
    
    if (hasChildren) {
      alert('Não é possível excluir uma conta que possui subcontas. Exclua as subcontas primeiro.');
      return;
    }
    
    if (window.confirm('Tem certeza que deseja excluir esta conta?')) {
      deleteAccount(id);
    }
  };

  const handleToggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      type: 'ASSET' as 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE',
      parentId: '',
    },
    validationSchema,
    onSubmit: (values) => {
      if (editingAccount) {
        updateAccount({
          ...values,
          id: editingAccount.id,
        });
      } else {
        addAccount(values);
      }

      handleClose();
    },
  });

  // Get top-level accounts
  const topLevelAccounts = accounts.filter(account => !account.parentId);

  // Get account icon based on type
  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'ASSET':
        return <AccountBalanceIcon />;
      case 'LIABILITY':
        return <CreditCardIcon />;
      case 'EQUITY':
        return <AccountBalanceWalletIcon />;
      case 'INCOME':
        return <TrendingUpIcon />;
      case 'EXPENSE':
        return <TrendingDownIcon />;
      default:
        return <AccountBalanceIcon />;
    }
  };

  // Get account type label
  const getAccountTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      ASSET: 'Ativo',
      LIABILITY: 'Passivo',
      EQUITY: 'Patrimônio',
      INCOME: 'Receita',
      EXPENSE: 'Despesa',
    };
    
    return typeMap[type] || type;
  };

  // Recursive function to render account tree
  const renderAccountTree = (accounts: Account[], parentId?: string, level = 0) => {
    const filteredAccounts = accounts.filter(account => account.parentId === parentId);
    
    return filteredAccounts.map(account => {
      const hasChildren = accounts.some(a => a.parentId === account.id);
      const isExpanded = expandedItems[account.id] || false;
      
      return (
        <React.Fragment key={account.id}>
          <ListItem
            sx={{
              pl: level * 4,
              borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            }}
          >
            <ListItemIcon>{getAccountIcon(account.type)}</ListItemIcon>
            <ListItemText
              primary={account.name}
              secondary={getAccountTypeLabel(account.type)}
            />
            <Box>
              <Tooltip title="Editar">
                <IconButton size="small" onClick={() => handleEdit(account)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Excluir">
                <IconButton size="small" onClick={() => handleDelete(account.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {hasChildren && (
                <Tooltip title={isExpanded ? 'Recolher' : 'Expandir'}>
                  <IconButton size="small" onClick={() => handleToggleExpand(account.id)}>
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </ListItem>
          {hasChildren && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              {renderAccountTree(accounts, account.id, level + 1)}
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  // Get flat list of accounts for dropdown
  const getFlatAccounts = (accounts: Account[], parentPath = '') => {
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
        title="Plano de Contas"
        subtitle="Gerencie suas contas e categorias"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Nova Conta
          </Button>
        }
      />

      <Paper sx={{ mt: 3 }}>
        <List>
          {renderAccountTree(accounts)}
        </List>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {editingAccount ? 'Editar Conta' : 'Nova Conta'}
          </DialogTitle>
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
              <Grid item xs={12}>
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
                    <MenuItem value="ASSET">Ativo</MenuItem>
                    <MenuItem value="LIABILITY">Passivo</MenuItem>
                    <MenuItem value="EQUITY">Patrimônio</MenuItem>
                    <MenuItem value="INCOME">Receita</MenuItem>
                    <MenuItem value="EXPENSE">Despesa</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="parent-label">Conta Pai</InputLabel>
                  <Select
                    labelId="parent-label"
                    id="parentId"
                    name="parentId"
                    value={formik.values.parentId}
                    onChange={formik.handleChange}
                    error={formik.touched.parentId && Boolean(formik.errors.parentId)}
                    label="Conta Pai"
                  >
                    <MenuItem value="">Nenhuma (Conta Principal)</MenuItem>
                    {flatAccounts
                      .filter(account => account.id !== (editingAccount?.id || ''))
                      .map((account) => (
                        <MenuItem key={account.id} value={account.id}>
                          {account.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingAccount ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Accounts;
