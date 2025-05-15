/**
 * Script para configurar o banco de dados no Supabase
 * 
 * Este script lê o arquivo schema.sql e fornece instruções para
 * configurar manualmente o banco de dados no Supabase, já que
 * não é possível executar o SQL diretamente via API.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Carrega as variáveis de ambiente
dotenv.config();

// Verifica se as variáveis de ambiente do Supabase estão configuradas
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('\x1b[31m%s\x1b[0m', 'Erro: As variáveis de ambiente SUPABASE_URL e SUPABASE_KEY são obrigatórias.');
  console.log('Por favor, crie um arquivo .env na raiz do projeto com as seguintes variáveis:');
  console.log('SUPABASE_URL=https://seu-projeto.supabase.co');
  console.log('SUPABASE_KEY=sua-chave-anon-key');
  process.exit(1);
}

// Inicializa o cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Lê o arquivo de esquema SQL
const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

console.log('\x1b[36m%s\x1b[0m', '=== Configuração do Banco de Dados ContaFácil ===');
console.log('\x1b[33m%s\x1b[0m', 'Este script irá guiá-lo na configuração do banco de dados no Supabase.');
console.log('\x1b[33m%s\x1b[0m', 'Você precisará executar manualmente o SQL no console do Supabase.');

// Testa a conexão com o Supabase
async function testConnection() {
  try {
    const { data, error } = await supabase.from('_dummy_query_').select('*').limit(1);
    
    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message);
    }
    
    console.log('\x1b[32m%s\x1b[0m', '✓ Conexão com o Supabase estabelecida com sucesso!');
    console.log(`URL do projeto: ${supabaseUrl}`);
    
    return true;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `✗ Erro ao conectar com o Supabase: ${error.message}`);
    return false;
  }
}

// Instruções para configurar o banco de dados
function showInstructions() {
  console.log('\n\x1b[36m%s\x1b[0m', '=== Instruções para Configurar o Banco de Dados ===');
  console.log('1. Acesse o painel de controle do Supabase: https://app.supabase.io');
  console.log('2. Selecione seu projeto');
  console.log('3. Vá para "SQL Editor" no menu lateral');
  console.log('4. Crie uma nova consulta e cole o conteúdo do arquivo schema.sql');
  console.log('5. Execute a consulta para criar todas as tabelas e políticas de segurança');
  console.log('\n\x1b[33m%s\x1b[0m', 'O arquivo schema.sql está localizado em:');
  console.log(schemaPath);
  
  console.log('\n\x1b[36m%s\x1b[0m', '=== Estrutura do Banco de Dados ===');
  console.log('O esquema inclui as seguintes tabelas:');
  console.log('- users: Informações dos usuários');
  console.log('- accounts: Contas financeiras');
  console.log('- transactions: Transações financeiras');
  console.log('- budgets: Orçamentos');
  console.log('- budget_categories: Categorias de orçamento');
  console.log('- financial_goals: Metas financeiras');
  console.log('- financial_reports: Relatórios financeiros');
  
  console.log('\n\x1b[36m%s\x1b[0m', '=== Segurança ===');
  console.log('O esquema inclui políticas de segurança Row Level Security (RLS)');
  console.log('para garantir que cada usuário só possa acessar seus próprios dados.');
}

// Função principal
async function main() {
  const connected = await testConnection();
  
  if (connected) {
    showInstructions();
    
    console.log('\n\x1b[32m%s\x1b[0m', '=== Próximos Passos ===');
    console.log('1. Configure o banco de dados seguindo as instruções acima');
    console.log('2. Configure a autenticação no painel do Supabase');
    console.log('3. Inicie o servidor de desenvolvimento com: npm run dev');
    
    console.log('\n\x1b[36m%s\x1b[0m', 'Para mais informações, consulte o README.md do projeto.');
  }
}

// Executa a função principal
main().catch(error => {
  console.error('\x1b[31m%s\x1b[0m', `Erro: ${error.message}`);
  process.exit(1);
});
