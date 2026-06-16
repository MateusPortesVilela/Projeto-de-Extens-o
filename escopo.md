# Escopo do Projeto OrthoCare

## Visão Geral

### Objetivo do sistema
OrthoCare é uma plataforma SaaS para gestão de acompanhamento ortopédico de pacientes e profissionais de saúde. O sistema centraliza histórico clínico, evolução da dor, exercícios terapêuticos, agenda de frequência e comunicação entre paciente, fisioterapeuta e médico.

### Público-alvo
- Pacientes em tratamento ortopédico
- Fisioterapeutas
- Médicos ortopedistas
- Clínicas e centros de reabilitação
- Administradores de serviços de saúde

### Problema que resolve
OrthoCare resolve a falta de uma ferramenta integrada e especializada para monitorar sintomas, registrar dor, recomendar exercícios e oferecer suporte colaborativo em tempo real. A solução reduz lacunas de comunicação, melhora adesão ao plano terapêutico e traz visibilidade sobre a recuperação.

### Benefícios
- Acompanhamento personalizado do paciente
- Maior engajamento no tratamento
- Suporte estruturado para profissionais
- Dados históricos acessíveis para decisões clínicas
- Automação de relatórios e métricas de recuperação
- Ferramentas para motivação e fidelização do paciente

## Funcionalidades

### Autenticação

#### Cadastro
- Formulário com nome completo, e-mail, senha e confirmação de senha
- Validação de e-mail e força de senha
- Verificação de duplicidade de conta
- Aceite de termos de uso e política de privacidade

#### Login
- Autenticação por e-mail e senha
- Validação de credenciais
- Redirecionamento para dashboard conforme perfil
- Mensagens claras de erro para credenciais inválidas

#### Recuperação de senha
- Solicitação por e-mail
- Token seguro com expiração temporária
- Página de redefinição de senha
- Notificação de alteração concluída

#### Sessão de usuário
- Sessão ativa com controle de expiração
- Renovação de token quando necessário
- Logout seguro
- Persistência de sessão opcional (lembrar-me)

### Perfil do Paciente

#### Dados pessoais
- Nome completo
- E-mail
- Telefone de contato
- Sexo

#### Foto
- Upload de imagem de perfil
- Exibição no dashboard e no perfil
- Armazenamento de URL segura

#### Idade
- Cálculo automático a partir da data de nascimento
- Exibição de idade atualizada no perfil

#### Peso
- Registro de peso atual
- Histórico de medidas para controle longitudinal

#### Altura
- Registro de altura em centímetros ou metros
- Uso em cálculos de IMC e recomendações

#### Objetivos
- Definição de metas terapêuticas
- Objetivos de mobilidade, dor e qualidade de vida
- Atualização periódica pelo paciente ou pelo profissional

#### Histórico ortopédico
- Descrição de lesões anteriores
- Procedimentos cirúrgicos
- Diagnósticos passados
- Tratamentos realizados

### Controle de Sintomas

#### Registro de sintomas
- Cadastro de sintomas ortopédicos por paciente
- Seleção de sintoma predefinido ou criação customizada

#### Intensidade
- Escala de intensidade de 0 a 10
- Registro por sintoma para análise qualitativa

#### Data
- Data e hora de cada registro
- Capacidade de registrar eventos passados

#### Observações
- Campo de texto livre para detalhes adicionais
- Possibilidade de anexar contexto clínico

#### Evolução histórica
- Visualização cronológica dos sintomas
- Comparação entre datas e padrões de piora ou melhora

### Escala de Dor

#### Registro diário
- Registro diário de nível de dor de 0 a 10
- Campo para comentários associados ao dia

#### Histórico
- Série temporal de registros de dor
- Gráfico de evolução
- Filtros por intervalo de tempo

#### Métricas
- Média semanal e mensal de dor
- Tendência de recuperação
- Alertas para aumentos significativos

### Exercícios

#### Catálogo
- Lista de exercícios ortopédicos
- Filtros por objetivo, região corporal e dificuldade

#### Vídeos
- Conteúdo multimídia incorporado
- Orientações visuais para execução correta
- Referência de formato e duração

#### Níveis
- Classificação por nível de dificuldade (iniciante, intermediário, avançado)
- Recomendações personalizadas conforme evolução

#### Categorias
- Agrupamento por tipo terapêutico (fortalecimento, alongamento, mobilidade)
- Navegação por região do corpo e propósito

#### Tempo estimado
- Duração sugerida de cada exercício
- Planejamento de sessão com estimativa total

#### Registro de conclusão
- Marcação de exercícios concluídos
- Data e hora de finalização
- Status de realização e observações

### Dashboard

#### Estatísticas
- Visão geral do progresso do paciente
- Total de exercícios concluídos
- Número de registros de dor
- Chamados e feedbacks ativos

#### Evolução
- Gráficos de desempenho e dor
- Indicadores de aderência a metas
- Comparativo de períodos

#### Frequência
- Frequência de atividades realizadas
- Calendário de presença
- Taxa de consistência semanal/mensal

#### Recuperação
- Monitoramento de recuperação funcional
- Projeção de evolução com base em dados históricos
- Alertas para queda de desempenho

### Calendário

#### Atividades realizadas
- Registro diário de sessões e exercícios
- Visualização mensal com status

#### Sequências
- Identificação de dias consecutivos de atividades
- Reconhecimento de padrões de rotina

#### Frequência mensal
- Relatório de frequência por mês
- Percentual de dias ativos
- Comparação com metas definidas

### Conquistas

#### Sistema de badges
- Badges visuais para metas atingidas
- Categorias: consistência, evolução, participação

#### Critérios de desbloqueio
- Sessões concluídas
- Registros de dor constantes
- Feedback fornecido
- Chamados resolvidos

### Atendimento

#### Suporte
- Canal de contato direto com a equipe
- Registro de dúvidas e solicitações

#### Abertura de chamados
- Criação de tickets com assunto e descrição
- Acompanhamento do status

#### Respostas
- Troca de mensagens entre usuário e equipe
- Histórico completo do atendimento

### Feedback

#### Avaliações
- Sistema de rating de 1 a 5 estrelas
- Avaliação do serviço e da experiência

#### Comentários
- Texto livre para sugestões e observações
- Feedback qualitativo de tratadores e pacientes

## Perfis de Usuário

### Paciente
- Acessa dashboard pessoal
- Registra dor e sintomas
- Visualiza plano de exercícios
- Abre e acompanha chamados
- Envia feedback
- Recebe conquistas e notificações

### Fisioterapeuta
- Acompanha pacientes vinculados
- Analisa evolução de dor e sintomas
- Sugere exercícios e revisa histórico
- Responde tickets e feedbacks
- Emite recomendações de tratamento

### Médico
- Visualiza dados clínicos relevantes
- Interpreta evolução ortopédica
- Consulta histórico de sintomas e dor
- Aprova ou altera protocolos terapêuticos
- Interage com equipe de reabilitação

### Administrador
- Gerencia usuários e permissões
- Monitora indicadores de uso
- Administra conteúdo de exercícios
- Supervisiona tickets e atendimento
- Garante integridade do sistema

## Requisitos Funcionais

- RF001: O sistema deve permitir cadastro de pacientes e profissionais.
- RF002: O sistema deve permitir login com e-mail e senha.
- RF003: O sistema deve enviar e-mail para recuperação de senha.
- RF004: O sistema deve manter sessão autenticada via JWT.
- RF005: O sistema deve permitir edição de perfil do paciente.
- RF006: O sistema deve armazenar foto de perfil do paciente.
- RF007: O sistema deve registrar data de nascimento, peso e altura.
- RF008: O sistema deve permitir definição de objetivos terapêuticos.
- RF009: O sistema deve armazenar histórico ortopédico.
- RF010: O sistema deve listar sintomas ortopédicos padrão.
- RF011: O sistema deve permitir registro de sintomas personalizados.
- RF012: O sistema deve capturar intensidade do sintoma de 0 a 10.
- RF013: O sistema deve guardar data e hora de cada registro de sintoma.
- RF014: O sistema deve permitir observações adicionais para sintomas.
- RF015: O sistema deve exibir evolução histórica de sintomas.
- RF016: O sistema deve registrar escala de dor diária.
- RF017: O sistema deve apresentar histórico de dor em gráfico.
- RF018: O sistema deve calcular métricas de dor média.
- RF019: O sistema deve exibir catálogo de exercícios.
- RF020: O sistema deve fornecer vídeos e descrições de exercícios.
- RF021: O sistema deve classificar exercícios por nível e categoria.
- RF022: O sistema deve informar tempo estimado de execução.
- RF023: O sistema deve permitir registro de conclusão de exercícios.
- RF024: O sistema deve apresentar dashboard de progresso.
- RF025: O sistema deve exibir estatísticas de frequência.
- RF026: O sistema deve mostrar evolução de recuperação.
- RF027: O sistema deve oferecer calendário de atividades.
- RF028: O sistema deve registrar atividades realizadas por data.
- RF029: O sistema deve listar sequências de dias ativos.
- RF030: O sistema deve apresentar frequência mensal de atividades.
- RF031: O sistema deve oferecer sistema de conquistas e badges.
- RF032: O sistema deve aplicar critérios de desbloqueio automáticos.
- RF033: O sistema deve permitir abertura de chamados de suporte.
- RF034: O sistema deve armazenar mensagens de atendimento.
- RF035: O sistema deve apresentar status do ticket em tempo real.
- RF036: O sistema deve permitir envio de avaliações ao final do atendimento.
- RF037: O sistema deve registrar comentários dos usuários.
- RF038: O sistema deve notificar o usuário sobre novidades.
- RF039: O sistema deve aplicar permissões por perfil.
- RF040: O sistema deve permitir gerenciamento de usuários por administrador.
- RF041: O sistema deve garantir exclusividade de e-mail por usuário.
- RF042: O sistema deve exibir dados de perfil apenas para paciente autenticado.
- RF043: O sistema deve permitir profissionais visualizarem pacientes vinculados.
- RF044: O sistema deve armazenar logs de criação e atualização.
- RF045: O sistema deve permitir filtro por período nos relatórios.
- RF046: O sistema deve disponibilizar filtros de busca para tickets.
- RF047: O sistema deve permitir visualização de conquistas desbloqueadas.
- RF048: O sistema deve apresentar resumo mensal de atividades.
- RF049: O sistema deve permitir reabertura de ticket em estado resolvido.
- RF050: O sistema deve gerar relatórios de evolução para profissionais.

## Requisitos Não Funcionais

- RNF001: A interface deve ser responsiva para desktop e mobile.
- RNF002: O sistema deve seguir padrões de acessibilidade WCAG básicos.
- RNF003: Tempo de resposta da API deve ser inferior a 500ms para consultas comuns.
- RNF004: A base de dados deve ser PostgreSQL em produção.
- RNF005: A autenticação deve usar HTTPS em todas as requisições.
- RNF006: Senhas devem ser armazenadas com hash seguro.
- RNF007: O sistema deve suportar 99,5% de disponibilidade.
- RNF008: Dados sensíveis devem ser criptografados em trânsito.
- RNF009: O código-fonte deve ser versionado em Git.
- RNF010: O sistema deve ter logs de auditoria em backend.
- RNF011: O aplicativo deve ser testado com cobertura de unidades e integração.
- RNF012: A arquitetura deve ser modular e extensível.
- RNF013: O design deve seguir identidade visual consistente.
- RNF014: Os backups do banco devem ser realizados regularmente.
- RNF015: O sistema deve ser compatível com navegadores modernos.
- RNF016: As APIs devem ser documentadas com OpenAPI ou similar.
- RNF017: A implantação deve ser automatizada com CI/CD.
- RNF018: O sistema deve permitir escalabilidade vertical e horizontal.
- RNF019: Arquivos estáticos devem ser servidos de forma eficiente.
- RNF020: O banco de dados deve possuir índices para consultas frequentes.
- RNF021: O sistema deve utilizar validação de dados no backend.
- RNF022: O código deve ser escrito em JavaScript/Node.js padrão ES modules.
- RNF023: O sistema deve oferecer monitoramento de erros em produção.
- RNF024: A interface deve ser intuitiva para perfis clínicos.
- RNF025: O banco deve suportar soft delete quando necessário.
- RNF026: O sistema deve manter histórico de alterações com timestamps.
- RNF027: A plataforma deve ser preparada para internacionalização.
- RNF028: As mensagens de erro devem ser claras e orientadas ao usuário.
- RNF029: O ambiente de desenvolvimento deve ser documentado.
- RNF030: O sistema deve tratar falhas de rede com mensagens apropriadas.

## Fluxos do Sistema

### Fluxo de Cadastro
1. Usuário acessa a página de cadastro.
2. Preenche nome, e-mail, senha, confirmação de senha e aceita os termos.
3. O frontend valida os campos localmente.
4. O backend valida e cria o registro no banco.
5. O sistema envia um e-mail de confirmação ou boas-vindas.
6. Usuário é redirecionado ao login ou à tela de onboarding.

### Fluxo de Login
1. Usuário acessa a página de login.
2. Informa e-mail e senha.
3. O backend verifica as credenciais e emite um JWT.
4. O frontend armazena o token com segurança.
5. Usuário é redirecionado para o dashboard apropriado.
6. Em caso de falha, o sistema informa motivo e orienta a correção.

### Fluxo de Registro de Dor
1. Paciente acessa o módulo de dor.
2. Escolhe nível de dor de 0 a 10.
3. Adiciona observações e data.
4. O registro é enviado ao backend.
5. Backend persiste o histórico com timestamp.
6. O dashboard atualiza métricas e gráficos.

### Fluxo de Realização de Exercício
1. Paciente abre o catálogo de exercícios.
2. Seleciona um exercício com vídeo e instruções.
3. Inicia o exercício e marca como concluído.
4. O sistema registra o tempo de início e fim.
5. O backend atualiza o status da sessão.
6. O dashboard reflete a conclusão e ativa badges.

### Fluxo de Atendimento
1. Usuário abre um ticket de suporte.
2. Preenche assunto e mensagem.
3. O sistema cria o ticket e notifica o time de suporte.
4. Profissional responde via sistema de mensagens.
5. Usuário recebe alerta e visualiza resposta.
6. Ticket é atualizado até ser resolvido.

### Fluxo de Conquistas
1. O sistema monitora ações do usuário.
2. Quando uma condição é atendida, a conquista é desbloqueada.
3. Usuário recebe notificação e badge.
4. Conquista é exibida no perfil e no dashboard.
5. Administrador pode revisar critérios e adicionar novas conquistas.

## Arquitetura

### Frontend
- HTML semântico para estrutura de conteúdo
- CSS moderno com responsividade e animações leves
- JavaScript para interatividade, consumo de APIs e estados

### Backend
- Node.js como ambiente de execução
- Express para APIs RESTful e roteamento
- Autenticação JWT e middleware de autorização

### Banco
- PostgreSQL para persistência de dados
- Modelagem relacional com integridade referencial
- Índices e constraints para performance e segurança

### Hospedagem
- Vercel para frontend e deploy estático
- Railway para backend e banco de dados em desenvolvimento
- Supabase para banco de dados PostgreSQL, autenticação e storage opcionais

## Roadmap

### MVP
- Cadastro, login e autenticação JWT
- Perfil de paciente e painel básico
- Registro de dor e sintomas
- Catálogo de exercícios com conclusão
- Dashboard de progresso simples
- Suporte com abertura de chamados

### Versão 1.0
- Calendário de frequência
- Sistema de conquistas e badges
- Feedback e avaliações
- Perfil clínico para fisioterapeutas e médicos
- Métricas de evolução e relatórios básicos

### Versão 2.0
- Notificações em tempo real
- Histórico avançado de sintomas e dor
- Recursos de analytics para profissionais
- Personalização de planos de exercício
- Integração com armazenamento de mídia e vídeos

### Versão 3.0
- Módulo SaaS completo com multi-tenant opcional
- Integração com dispositivos de saúde
- Suporte a API pública para apps móveis
- Inteligência de recomendação de exercícios
- Análise preditiva de recuperação
