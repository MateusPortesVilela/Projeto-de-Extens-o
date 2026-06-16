# LojaVendas - Sistema de Varejo (Projeto de Extensão)

Sistema Web FullStack para gerenciamento de vendas de uma loja de varejo.

## Tecnologias Utilizadas
- **Frontend:** HTML5, CSS3 (Vanilla com custom variables), JavaScript (Fetch API)
- **Backend:** PHP 8+
- **Banco de Dados:** MySQL
- **Ambiente:** Node.js + PHP (XAMPP) ou XAMPP

---

## 🚀 Como Executar com npm (Recomendado)

### Pré-requisitos
- [Node.js 18+](https://nodejs.org/)
- PHP instalado (XAMPP) e **MySQL** rodando com o banco importado

### Passo 1: Instalar dependências
```bash
npm install
```

### Passo 2: Subir o servidor de desenvolvimento
```bash
npm run dev
```

Acesse: **http://localhost:8000**

O comando sobe o frontend e a API PHP (`php/`) no mesmo servidor. Se o PHP não for encontrado, apenas os arquivos estáticos são servidos.

### Passo 3: Validar o projeto (build)
```bash
npm run build
```

Verifica se os arquivos essenciais (`index.html`, `style/style.css`, `php/`) estão presentes.

### Variáveis opcionais

| Variável  | Padrão      | Descrição |
|-----------|-------------|-----------|
| `PORT`    | `8000`      | Porta do servidor local |
| `PHP_BIN` | automático  | Caminho do PHP, ex.: `C:\xampp\php\php.exe` |

Exemplo no PowerShell:
```powershell
$env:PHP_BIN = "C:\xampp\php\php.exe"
npm run dev
```

---

## 🚀 Como Executar o Projeto (Guia XAMPP — alternativo)

O PHP necessita de um servidor web para funcionar. Siga os passos abaixo para rodar o projeto localmente:

### Passo 1: Instalar o XAMPP
Se você ainda não possui o XAMPP, baixe e instale a versão para Windows:
👉 [https://www.apachefriends.org/pt_br/index.html](https://www.apachefriends.org/pt_br/index.html)

### Passo 2: Iniciar os Serviços
1. Abra o **XAMPP Control Panel**.
2. Clique em **"Start"** ao lado de **Apache**.
3. Clique em **"Start"** ao lado de **MySQL**.
*(Ambos devem ficar com o fundo verde).*

### Passo 3: Configurar o Banco de Dados
1. No navegador, acesse: [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/)
2. Clique na aba **"Importar"** (menu superior).
3. Na seção "Arquivo para importar", clique em "Escolher arquivo".
4. Selecione o arquivo `sql/schema.sql` presente na pasta deste projeto.
5. Role até o final da página e clique em **"Executar"**.
*(Isso criará o banco `loja_vendas` e inserirá alguns dados iniciais).*

### Passo 4: Servir o Projeto
Para que o Apache consiga ler os arquivos, eles precisam estar na pasta `htdocs` do XAMPP (`C:\xampp\htdocs`).

**Método Recomendado (Sem mover os arquivos):**
Crie um link simbólico da pasta do seu projeto para dentro do `htdocs`.
1. Abra o **Windows PowerShell como Administrador**.
2. Execute o comando abaixo (ajuste os caminhos se necessário):
```powershell
cmd /c mklink /D "C:\xampp\htdocs\ProjetoExtensao" "C:\Users\User\OneDrive\Desktop\Natan\Programação\Faculdade_Natan\ProjetoExtensao"
```

**Método Alternativo:**
Copie toda a pasta `ProjetoExtensao` e cole dentro de `C:\xampp\htdocs\`.

### Passo 5: Acessar o Sistema
Abra o navegador e acesse a URL:
👉 **[http://localhost/ProjetoExtensao/](http://localhost/ProjetoExtensao/)**

---

## 📝 Regras de Negócio Implementadas

1. **Restrição Diária:** A loja realiza no máximo **50 vendas por dia**. O sistema bloqueia novas vendas caso este limite seja atingido.
2. **Taxa de Devolução:** Se um item de um pedido for devolvido pela segunda vez (ou mais), o sistema aplica automaticamente uma taxa de **R$ 20,00** referente ao transporte.

---

## 📊 Relatórios

1. **Diário:** Lista pedidos do dia com valores individuais e total consolidado.
2. **Mensal:** Total vendido e faturamento consolidado de cada mês do ano selecionado.
3. **Anual:** Total anual com meses listados em ordem *decrescente* de faturamento (Ranking).
