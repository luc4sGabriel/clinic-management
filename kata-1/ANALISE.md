1. Qual estrutura de dados você escolheu para modelar a fila e por quê?
- Escolhi a estrutura List<T> e usei o LINQ do C# pra ordernar levanto em conta um ambiente de clinica razoavel no quesito requisicoes , onde a List desempenha bem e tem uma legibilidade e facilidade de uso e maanutencao , alé do uso do LINQ que nos permite fazer varias regras de negócio de forma prática e simples tambem.

2. Qual a complexidade de tempo do seu algoritmo de ordenação? Seria diferente se a lista tivesse 1 milhão de pacientes?
- O(n log n) . Sim , se tivessemos 1 milhao de requisicoes , a List ja ficaria inviável de se utilizar devido a seu proprio tamanho , sempre que precisasse inserir um novo paciente , ia ser muito demorado pra reescrever a lista inteira . Nesses casos seria interessante ordenar por prioridade , sem precisar reordenar a fila toda . pesquisei aqui alguns algoritmos e vi que existe um proprio pra essas situacoes no C# que é o Priority Queue.

3. As regras 4 e 5 interagem entre si? Descreva o que acontece quando um paciente tem 15 anos e urgência MÉDIA.
- Em teoria , nao , e é importante que os programadores do sistema nao permitam de nenhuma forma essas ambiguidades ou brechas do codigo . 15 anos , urgencia Média => novaUrgencia = Alta

4. Se a clínica adicionasse uma 6ª regra amanhã, como seu código lidaria com essa extensão?
- Por mais simples , construi com a intencao dele ser escalável , entao o programa lidaria muito bem com uma nova regra . E a julgar que sistemas criticos como o de clinicas tem muitas regras , o certo seria separar as regras em classes e instanciar elas onde for necessario , desacoplando o codigo
