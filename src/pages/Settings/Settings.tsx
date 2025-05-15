import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Save as SaveIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
} from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';
import PageHeader from '../../components/common/PageHeader';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useAppContext();
  const [currency, setCurrency] = useState('BRL');
  const [language, setLanguage] = useState('pt-BR');
  const [backupOpen, setBackupOpen] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLInputElement> | any) => {
    setCurrency(event.target.value as string);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement> | any) => {
    setLanguage(event.target.value as string);
  };

  const handleSaveSettings = () => {
    // In a real app, this would save settings to backend or local storage
    showSnackbar('Configurações salvas com sucesso!', 'success');
  };

  const handleBackupOpen = () => {
    setBackupOpen(true);
  };

  const handleBackupClose = () => {
    setBackupOpen(false);
  };

  const handleBackupCreate = () => {
    // In a real app, this would create a backup
    showSnackbar('Backup criado com sucesso!', 'success');
    handleBackupClose();
  };

  const handleRestoreOpen = () => {
    setRestoreOpen(true);
  };

  const handleRestoreClose = () => {
    setRestoreOpen(false);
  };

  const handleRestore = () => {
    // In a real app, this would restore from a backup
    showSnackbar('Dados restaurados com sucesso!', 'success');
    handleRestoreClose();
  };

  const handleExportOpen = () => {
    setExportOpen(true);
  };

  const handleExportClose = () => {
    setExportOpen(false);
  };

  const handleExport = () => {
    // In a real app, this would export data
    showSnackbar('Dados exportados com sucesso!', 'success');
    handleExportClose();
  };

  const handleImportOpen = () => {
    setImportOpen(true);
  };

  const handleImportClose = () => {
    setImportOpen(false);
  };

  const handleImport = () => {
    // In a real app, this would import data
    showSnackbar('Dados importados com sucesso!', 'success');
    handleImportClose();
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Mock backups for demo
  const backups = [
    { id: '1', name: 'Backup Automático', date: '2025-05-10 10:30:00', size: '2.3 MB' },
    { id: '2', name: 'Backup Manual', date: '2025-05-05 15:45:00', size: '2.1 MB' },
  ];

  return (
    <Box>
      <PageHeader
        title="Configurações"
        subtitle="Personalize sua experiência no ContaFácil"
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Preferências Gerais
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="currency-label">Moeda</InputLabel>
                  <Select
                    labelId="currency-label"
                    id="currency"
                    value={currency}
                    onChange={handleCurrencyChange}
                    label="Moeda"
                  >
                    <MenuItem value="BRL">Real Brasileiro (R$)</MenuItem>
                    <MenuItem value="USD">Dólar Americano ($)</MenuItem>
                    <MenuItem value="EUR">Euro (€)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="language-label">Idioma</InputLabel>
                  <Select
                    labelId="language-label"
                    id="language"
                    value={language}
                    onChange={handleLanguageChange}
                    label="Idioma"
                  >
                    <MenuItem value="pt-BR">Português (Brasil)</MenuItem>
                    <MenuItem value="en-US">English (US)</MenuItem>
                    <MenuItem value="es">Español</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch checked={theme === 'dark'} onChange={toggleTheme} />}
                  label="Modo Escuro"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveSettings}
                >
                  Salvar Configurações
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Backup e Restauração
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  onClick={handleBackupOpen}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Criar Backup
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CloudDownloadIcon />}
                  onClick={handleRestoreOpen}
                  fullWidth
                >
                  Restaurar Backup
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Backups Disponíveis
                </Typography>
                <List>
                  {backups.map((backup) => (
                    <ListItem key={backup.id} divider>
                      <ListItemText
                        primary={backup.name}
                        secondary={`${backup.date} - ${backup.size}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Importar e Exportar Dados
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  startIcon={<CloudDownloadIcon />}
                  onClick={handleExportOpen}
                  fullWidth
                >
                  Exportar Dados
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  onClick={handleImportOpen}
                  fullWidth
                >
                  Importar Dados
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Conta e Segurança
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome"
                  defaultValue="Usuário"
                  variant="outlined"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="E-mail"
                  defaultValue="usuario@exemplo.com"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Senha Atual"
                  type="password"
                  variant="outlined"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Nova Senha"
                  type="password"
                  variant="outlined"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Confirmar Nova Senha"
                  type="password"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                >
                  Atualizar Informações
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Backup Dialog */}
      <Dialog open={backupOpen} onClose={handleBackupClose} maxWidth="sm" fullWidth>
        <DialogTitle>Criar Backup</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="backup-name"
            label="Nome do Backup"
            type="text"
            fullWidth
            variant="outlined"
            defaultValue={`Backup ${new Date().toLocaleDateString('pt-BR')}`}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Isso criará um backup completo dos seus dados financeiros. O backup será armazenado localmente no seu dispositivo.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBackupClose}>Cancelar</Button>
          <Button onClick={handleBackupCreate} variant="contained">
            Criar Backup
          </Button>
        </DialogActions>
      </Dialog>

      {/* Restore Dialog */}
      <Dialog open={restoreOpen} onClose={handleRestoreClose} maxWidth="sm" fullWidth>
        <DialogTitle>Restaurar Backup</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Selecione um backup para restaurar:
          </Typography>
          <List>
            {backups.map((backup) => (
              <ListItem
                key={backup.id}
                component="li"
                onClick={() => {}}
                divider
                sx={{ cursor: 'pointer' }}
              >
                <ListItemText
                  primary={backup.name}
                  secondary={`${backup.date} - ${backup.size}`}
                />
              </ListItem>
            ))}
          </List>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Atenção: Restaurar um backup substituirá todos os seus dados atuais. Esta ação não pode ser desfeita.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRestoreClose}>Cancelar</Button>
          <Button onClick={handleRestore} variant="contained" color="warning">
            Restaurar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportOpen} onClose={handleExportClose} maxWidth="sm" fullWidth>
        <DialogTitle>Exportar Dados</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Selecione o formato de exportação:
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="export-format-label">Formato</InputLabel>
            <Select
              labelId="export-format-label"
              id="export-format"
              value="csv"
              label="Formato"
            >
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="excel">Excel</MenuItem>
              <MenuItem value="json">JSON</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Selecione os dados que deseja exportar:
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <FormControlLabel control={<Switch defaultChecked />} label="Transações" />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel control={<Switch defaultChecked />} label="Contas" />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel control={<Switch defaultChecked />} label="Orçamentos" />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel control={<Switch defaultChecked />} label="Metas" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExportClose}>Cancelar</Button>
          <Button onClick={handleExport} variant="contained">
            Exportar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importOpen} onClose={handleImportClose} maxWidth="sm" fullWidth>
        <DialogTitle>Importar Dados</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Selecione o arquivo para importar:
          </Typography>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 2, p: 2, height: 100, border: '2px dashed' }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CloudUploadIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography>Clique para selecionar ou arraste o arquivo aqui</Typography>
            </Box>
            <input type="file" hidden />
          </Button>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Atenção: Importar dados pode substituir ou duplicar informações existentes. Recomendamos fazer um backup antes de prosseguir.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImportClose}>Cancelar</Button>
          <Button onClick={handleImport} variant="contained">
            Importar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;
