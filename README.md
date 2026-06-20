# OrtoApp - Plataforma de Acompanhamento Ortopédico

OrtoApp é uma plataforma web de acompanhamento ortopédico que combina informações de pacientes, controle de sintomas, escala de dor, exercícios terapêuticos, calendário de frequência e suporte por tickets.

## Tecnologias Utilizadas
- **Frontend:** HTML, CSS e JavaScript
- **Backend:** PHP 8+
- **Banco de Dados:** PostgreSQL (ou MySQL para compatibilidade local)
- **Ambiente:** Node.js para scripts auxiliares e frontend estático

## Estrutura do Projeto
- `index.html` — página principal da aplicação
- `style/style.css` — estilos principais
- `php/` — endpoints de backend em PHP
- `sql/schema.sql` — modelo de banco de dados para OrtoApp
- `scripts/dev.js` — servidor de desenvolvimento local
- `scripts/build.js` — verificação de arquivos essenciais

## 🚀 Execução Local

### Pré-requisitos
- [Node.js 18+](https://nodejs.org/)
- PHP 8+ instalado e disponível no PATH ou via `PHP_BIN`

### Passo 1: Instalar dependências
```bash
npm install
```

### Passo 2: Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

Acesse o projeto em:

**http://localhost:8000**

O servidor tentará iniciar o PHP integrado. Se o PHP não estiver disponível, ele serve apenas os arquivos estáticos.

### Passo 3: Validar o projeto
```bash
npm run build
```

Esse comando verifica se os arquivos essenciais (`index.html`, `style/style.css` e `php/`) existem.

### Variáveis de ambiente
- `PORT` — porta do servidor local (padrão: `8000`)
- `HOST` — host local (padrão: `localhost`)
- `PHP_BIN` — caminho para o executável PHP, ex.: `C:\xampp\php\php.exe`

Exemplo no PowerShell:
```powershell
$env:PHP_BIN = "C:\xampp\php\php.exe"
npm run dev
```

## Banco de Dados
O schema de banco está em `sql/schema.sql`. Ele foi atualizado para um modelo PostgreSQL profissional com UUIDs, triggers e views úteis.

### Importando o schema
Se for utilizar PostgreSQL, execute o script com o cliente `psql`:
```bash
psql -d ortoapp -f sql/schema.sql
```

No ambiente local com MySQL, adapte o arquivo para compatibilidade ou use o script como referência.

## Funcionalidades Principais
- Cadastro e login de usuários
- Gerenciamento de perfis de pacientes
- Registro de sintomas e escala de dor
- Catálogo de exercícios com registros de conclusão
- Calendário de atividades e frequência
- Sistema de conquistas e notificações
- Suporte via tickets e histórico de atendimento
- Avaliações e feedbacks dos usuários

## Desenvolvimento

### Ajustar porta ou host
Para alterar a porta ou host, defina as variáveis antes de executar:
```bash
$env:PORT = 3000
$env:HOST = "127.0.0.1"
npm run dev
```

### Suporte ao PHP
O script `scripts/dev.js` tenta encontrar PHP automaticamente. Se não encontrar, ele serve somente arquivos estáticos e exibe uma mensagem de aviso.

## Observações
- Este README reflete a estrutura atual do projeto e os scripts de execução existentes.
- Para evoluir o backend para Node.js/Express, mantenha a pasta `php/` como implementação de transição.
- O modelo de banco `sql/schema.sql` deve ser revisado antes de uso em produção para adequar credenciais e regras de deployment.
