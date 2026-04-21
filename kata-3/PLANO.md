# Secao 1 Diagnóstico
# Para cada um dos 5 problemas listados, identifique:

# A causa raiz mais provável
# O risco que ele representa (técnico e de negócio)
# Se é um problema urgente ou importante (use a Matriz de Eisenhower ou equivalente)

##  1. 
##  • Causa Raiz: 
### 5 anos de projeto , 800 pedidos por dia . (800 * 365) * 5 = 1M e meio de pedidos no banco , ou seja , muitos registros . Então a provável causa do gargalo nas consultas seja a falta de índices para facilitar a busca no banco e/ou algoritmo de ordenação não adequado ao ambiente .

##  • Risco: 
### Cliente impaciente pode desistir da compra , além de ficar insatisfeito com a demora de carregamento da tela , e pensar que pode ser seu hardware ou conexão à internet

##  • Classificacao: 
### Urgente e Importante


## 2. 
##  • Causa Raiz: 
### Idempotência que está faltando . O sistema não verifica se já foi processado/criado um pedido com o mesmo token antes de salvar/editar no banco , possibilitando essa brecha do tamanho de um buraco negro supermassivo no código.

##  • Risco: 
### Integridade dos dados inexistente , pode vir a causar prejuízos financeiros de ambas as partes (cliente/dono) e de logística/qualidade

##  • Classificacao: 
### Urgente e Importante


## 3. 
##  • Causa Raiz: 
### Pipeline de CI/CD inexistente praticamente . 

##  • Risco: 
### O famoso: 'na minha máquina funciona' (devs trabalhando no mesmo projeto com ambientes diferentes do repositório do git e do projeto local , o que por si só faz uma bagunça grande , além de atrasar o desenvolvimento e causar uma chuva de rebase. ) , além do mais que isso foi feito numa regra de negócio importante e crítica (financeira e logística) que é a do cálculo de frete.

##  • Classificacao: 
### Urgente


## 4. 
##  • Causa Raiz: 
### Falta de boas práticas de código como o SOLID ou outros padrões de projeto no quesito centralização de código sem modular. 

##  • Risco: 
### Para fazer uma manutenção nessa lógica é uma experiência péssima, qualquer mínima alteração , uma renomeação de variável , e é necessário alterar 500 linhas e quebrar diversas outras funções . E para escalar segue a mesma ideia 

##  • Classificacao: 
### Importante


## 5. 
##  • Causa Raiz: 
### É tentador programar sem testar , sem separar em branchs (incluindo eu em algumas vezes nesse projeto) visando uma rápida entrega ..

##  • Risco: 
### Qualquer alteração pode vir a trazer bugs constantes no código e que muitas vezes passam despercebidos pelo compilador . Pode fazer a aplicação ficar fora várias vezes e dependendo da complexidade do bug , por várias horas . Ou ser preciso fazer um rollback em produção 

##  • Classificacao: 
### Importante

--------------------------------------------------------------------------

# Secao 2 Plano de acao
# Proponha ações concretas para os 3 problemas que você priorizaria primeiro. Para cada ação:

# Descreva o que será feito em termos técnicos
# Estime o esforço (horas/dias, pode ser aproximado)
# Indique o critério de sucesso — como você saberá que o problema foi resolvido?

##  1. *Dois pedidos foram criados em duplicidade na última semana*
##  • O que será feito:

### Implementar um serviço de mensageria , usando uma fila FIFO , de preferência da AWS que eu já dei uma olhada e sei que é bem completo . Caso o usuário envie a mesma requisição mais de uma vez , a fila vai identificar a idempotência e descartará os eventos excedentes antes mesmo do back-end processá-los , restando apenas um a ser consumido pela API


##  • Esforço estimado:

### 4/5 dias , porque vai ser necessário configurar a infra na AWS , questão de token etc. Além de adaptar todo o fluxo de pedidos para utilizar da fila e processar


##  • Critério de sucesso:

### Mandar a mesma requisição várias vezes num curto espaço de tempo , e o sistema processar apenas 1 , sem duplicidade .


##  2. *O endpoint de consulta de pedidos demora 8–12 segundos em horário de pico.*
##  • O que será feito:

### A princípio , paginação na rota de consulta de pedidos , para não jogar milhões de pedidos de uma só vez na tela . Criaria índices no banco de dados nas colunas mais utilizadas para facilitar a busca e entrega .


##  • Esforço estimado:

### 2/3 dias , levando em conta uma paginação bem feita , para ser reutilizada caso precise em outro trecho de código . Os índices , alguns bancos já dispõem de ferramentas que verificam as colunas mais requisitadas e já sugerem a criação dos índices , uma tarefa rápida


##  • Critério de sucesso:

### Tempo de resposta do mesmo endpoint cair drasticamente e ficar num tempo aceitável para a experiência de usuário.


##  3. *Um bug de cálculo de frete foi corrigido em produção diretamente (sem PR, sem teste).*
##  • O que será feito:

### Configurar pipeline CI/CD , bloquear o acesso livre ao server de prod , e só mergear na main após ter o PR revisado e aprovado.


##  • Esforço estimado:

### 1 dia , só configurar o GitHub Actions ou o GitLab e mexer nas configs do repo


##  • Critério de sucesso:

### Qualquer alteração em produção deve ter um history no git (commit/PR)

--------------------------------------------------------------------------

# Seção 3 — Decisão de arquitetura
# O arquivo de 4.000 linhas precisa ser refatorado. Você tem duas opções sendo discutidas no time:

# Opção A — Refatoração incremental
# Opção B — Reescrita do módulo
# Extrair módulos menores gradualmente, mantendo o sistema funcionando durante o processo. Menor risco, mais lento.
# Reescrever o módulo do zero com arquitetura limpa e testes. Maior risco de regressão, entrega mais rápida do resultado final.

# Argumente qual das duas opções você escolheria e por quê. Considere o contexto descrito (sem testes, sistema em produção, time ocupado). Não há resposta errada — a qualidade da argumentação é o que será avaliado.


# Resposta:
## Diante do cenário em que não há nenhum teste , além do time ocupado e o fato do sistema estar em produção .. Significa que é necessário realizar algo que não altere muita coisa de uma vez , quanto menor a área de impacto , melhor .. além do que tem que ser algo que não tome muito tempo do time e que mantenha o sistema de pé , funcionando , e fora o fato de ser um sistema 'crítico' como hospitais/clínicas . Eu optaria pela Opção A com toda certeza, migrando um pedaço de código por vez aos poucos . Num cenário bem estruturado de testes , deploy e time livre , talvez eu pensaria na Opção B .

--------------------------------------------------------------------------

# Seção 4 — Requisitos Não Funcionais ignorados
# Identifique pelo menos 3 Requisitos Não Funcionais (RNFs) que claramente não estão sendo atendidos no sistema descrito. Para cada um:

# Nomeie o RNF (ex.: desempenho, disponibilidade, manutenibilidade...)
# Explique por que ele está comprometido com base nos incidentes descritos
# Proponha uma métrica mensurável para monitorá-lo


# 1. Desempenho

# Por que está comprometido:
## A rota de consulta de pedidos leva de 8s a 12s para a API renderizar em horários de pico . Esses números não são bons indicativos de 'saúde' do software

# Métrica para monitoramento:
## Tempo de resposta máximo das rotas de 800ms , salvo algumas exceções em raros casos .


# 2. Manutenibilidade

# Por que está comprometido:
## Porque um único arquivo de regras de negócio tem 4000 linhas e nenhum teste sequer escrito . Dá medo só de falar nesse trecho do código

# Métrica para monitoramento:
## Cobertura de testes de uns 70% , priorizando partes críticas do sistema . E limite de linhas de código por arquivo , além de recomendar a descentralização de código quando o arquivo estiver muito extenso e manter o princípio da simplicidade de entendimento do código nesses extremos . 


# 3. Integridade

# Por que está comprometido:
## Registros duplicados e hotfixes feitos diretamente em produção quebram os princípios da integridade do software . Logo não tem nenhuma garantia de segurança no processamento das transações , e nem da testabilidade e confiança da aplicação .

# Métrica para monitoramento:
## Nenhum pedido duplicado e todos os deploys feitos via pipeline , devidamente testados e aprovados.


# 4. Disponibilidade 

# Por que está comprometido:
## Rotas podendo custar + de 10000ms para renderizar , o que já pode considerar uma indisponibilidade , ainda que parcial . Se o banco travar nessa consulta , o sistema todo para .

# Métrica para monitoramento:
## Usar alguma ferramenta de health check para verificar a disponibilidade e realizar testes de stress no sistema para verificar possíveis gargalos .