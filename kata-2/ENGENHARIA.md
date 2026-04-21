# 1. Que decisões de arquitetura você tomou no backend (separação de responsabilidades, camadas, etc.)?
## Resposta: 
### No back-end , eu usei como base o Clean Architecture , separando bem a camada de Domínio (Entities), Use cases para a lógica de negócio, Infrastructure para se comunicar com o externo e usando factories para injeção de dependências e desacoplamento de código. 


# 2. Como você garantiria que a API é confiável em produção? Mencione pelo menos dois aspectos de qualidade/observabilidade.
## Resposta: 
### Vou tentar entregar a tempo com tudo isso , mas primeiro , para garantir a qualidade , usaria dos testes de software (unitário, integração, e2e). Além de uma rota /health para checar a 'saúde' da API . Para observabilidade , usaria um logger (dependência) , ou até mesmo um simples , criando a classe e fazendo de forma manual os logs para monitorar cada requisição. 


# 3. Se o sistema precisasse suportar múltiplos usuários com autenticação, o que mudaria na sua arquitetura atual?
## Resposta: 
### Teria que criar uma tabela de usuários , linkar cada Task(N) a Usuários(1) N:1 . Implementação de Middlewares na autenticação dos usuários para proibir alterações indevidas , além de injetar o user_id em cada requisição autenticada . Aí nessas alterações eu já teria que modificar os use-cases e os testes para implementar também a autenticação, além de modificar a busca das tasks para retornar pelo id do user autenticado e etc. Já teria também que baixar dependências de encriptação ex: Bcryptjs via service para manter o domínio puro de bibliotecas e mundo externo . Eu sou fã da arquitetura hexagonal , que é uma base também da clean architecture , mas para sistemas mais complexos , até pela questão de clareza de código , escalabilidade e manutenção eu prefiro a hexagonal ..