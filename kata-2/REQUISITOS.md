4.1 Contexto
Uma equipe interna precisa de uma ferramenta simples para gerenciar tarefas do dia a dia. O produto é um painel web com backend e frontend integrados. Os requisitos foram passados de forma informal pelo cliente interno — sua primeira tarefa é identificar as ambiguidades antes de implementar.

4.2 Requisitos informais (como o cliente descreveu)

"Preciso de uma tela onde eu veja minhas tarefas. Cada tarefa tem um título e uma situação.
 Quero poder criar novas, marcar como feita e deletar as que não preciso mais.
 Ah, e precisa ter um filtro pra eu ver só as pendentes ou só as concluídas.
 Se der, queria também uma prioridade nas tarefas. Mas isso pode ficar pra depois."


4.3 O que você deve entregar
Parte A — Análise de requisitos (obrigatório)
Antes de qualquer código, escreva em um arquivo REQUISITOS.md dentro de kata-2/ respondendo:


# 1. Liste pelo menos 3 ambiguidades ou informações faltantes nos requisitos acima.
## Resposta:
### 1. Nao explicou muito bem sobre o que seria essa situacao ..
### 2. Nao explicou muito bem sobre a delecao da task ..
### 3. Nao falou sobre edicao das tasks , por mais que seja possivel excluir e criar uma nova , isso polpa no tamanho do banco de dados ..

# 2. Para cada ambiguidade, escreva a pergunta que você faria ao cliente e a decisão que você tomou na ausência da resposta.
## Resposta:
### 1. O que seria especificamente a "situação"? Um status ou uma descrição? . Na ausencia da resposta , implementei a descricao de cada task e criei status pra cada task tambem . 
### 2. As tarefas excluídas devem ser apagadas permanentemente ou mantidas para recuperação futura? Na ausencia da resposta , implementei o soft delete.
### 3. Gostaria que fosse possível editar as tarefas após a criação? Na ausencia da resposta , criei uma rota que faz esse trabalho de edicao .

# 3. Defina os Requisitos Funcionais (RF) e Requisitos Não Funcionais (RNF) formalmente, com base no que você entendeu.
## Resposta:
## Requisitos Funcionais (RF)
### RF01 - Criar Tarefa: O sistema deve permitir a criação de tarefas informando título e descrição opcional.
### RF02 - Listar Tarefas: O sistema deve exibir uma lista de todas as tarefas que não foram excluídas.
### RF03 - Atualizar Status: O sistema deve permitir marcar uma tarefa como "Pendente" ou "Concluída".
### RF04 - Exclusão Lógica: O sistema deve permitir remover uma tarefa da visualização sem apagá-la fisicamente do banco de dados.
### RF05 - Filtragem: O sistema deve oferecer filtros por status: Todas, Pendentes e Concluídas.

## Requisitos Não Funcionais (RNF)
### RNF01 - Performance: As atualizações de status devem ser processadas via requisições assíncronas (Axios) para evitar o recarregamento total da página.
### RNF02 - Usabilidade: A interface deve ser responsiva e utilizar princípios de design moderno (Clean UI, feedback visual de conclusão).
### RNF03 - Confiabilidade: O sistema deve utilizar o método PATCH para atualizações parciais, garantindo que apenas o campo alterado seja enviado ao servidor.


# 4. O requisito de prioridade foi marcado como "pode ficar pra depois". Como você trataria isso no seu backlog?
## Resposta:
### Eu deixaria esse "card"(numa linguagem como a do trello ou qualquer ferramenta de gestao) para após um produto minimo , numa coluna de 'A fazer/ Proxima Sprint' sendo mais especifico, tambem deixei o codigo escalavel a ponto de aceitar futuras features e regras de negocio