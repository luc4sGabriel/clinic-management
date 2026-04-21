# 1. Qual estrutura de dados você escolheu para modelar a fila e por quê?
## - Escolhi a estrutura List<T> e usei o LINQ do C# para ordenar levando em conta um ambiente de clínica razoável no quesito requisições , onde a List desempenha bem e tem uma legibilidade e facilidade de uso e manutenção , além do uso do LINQ que nos permite fazer várias regras de negócio de forma prática e simples também.

# 2. Qual a complexidade de tempo do seu algoritmo de ordenação? Seria diferente se a lista tivesse 1 milhão de pacientes?
## - O(n log n) . Sim , se tivéssemos 1 milhão de requisições , a List já ficaria inviável de se utilizar devido ao seu próprio tamanho , sempre que precisasse inserir um novo paciente , ia ser muito demorado para reescrever a lista inteira . Nesses casos seria interessante ordenar por prioridade , sem precisar reordenar a fila toda . Pesquisei aqui alguns algoritmos e vi que existe um próprio para essas situações no C# que é o PriorityQueue.

# 3. As regras 4 e 5 interagem entre si? Descreva o que acontece quando um paciente tem 15 anos e urgência MÉDIA.
## - Em teoria , não , e é importante que os programadores do sistema não permitam de nenhuma forma essas ambiguidades ou brechas do código . 15 anos , urgência Média => novaUrgencia = Alta

# 4. Se a clínica adicionasse uma 6ª regra amanhã, como seu código lidaria com essa extensão?
## - Por mais simples , construí com a intenção dele ser escalável , então o programa lidaria muito bem com uma nova regra . E a julgar que sistemas críticos como o de clínicas têm muitas regras , o certo seria separar as regras em classes e instanciar elas onde for necessário , desacoplando o código
