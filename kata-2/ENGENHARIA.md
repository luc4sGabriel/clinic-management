# 1. Que decisões de arquitetura você tomou no backend (separação de responsabilidades, camadas, etc.)?
## Resposta: 
### No back-end , eu usei como base o Clean Architecture , separando bem a camada de Dominio(Entities), Use cases para a logica de negocio, InfraStructure pra se comunicar com o externo e usando factories pra injecao de dependencias e desacoplamento de codigo. 


# 2. Como você garantiria que a API é confiável em produção? Mencione pelo menos dois aspectos de qualidade/observabilidade.
## Resposta: 
### Vou tentar entregar a tempo com tudo isso , mas primeiro , pra garantir a qualidade , usaria dos testes de software (unitario, integracao, e2e). Alem de uma rota /health pra checar a 'saúde' da API . Pra observabilidade , usaria um logger (dependencia) , ou ate mesmo um simples , criando a classe e fazendo de forma manual os logs pra monitorar cada requisicao. 


# 3. Se o sistema precisasse suportar múltiplos usuários com autenticação, o que mudaria na sua arquitetura atual?
## Resposta: 
### Teria que criar uma tabela de usuarios , linkar cada Task(N) a Usuarios(1) N:1 . Implementacao de Middlewares na autenticacao dos usuarios pra proibir alteracoes indevidas , alem de injetar o user_id em cada requisicao autenticada . Ai nessas alteracoes eu ja teria que modificar os use-cases e os testes pra implementar tambem a autenticacao, alem de modificar a busca das tasks pra retornar pelo id do user autenticado e etc. Ja teria tambem que baixar dependencias de  encriptacao ex: Bcriptjs via service pra manter o dominio puro de bibliotecas e mundo externo . Eu sou fa da arquitetura hexagonal , que uma base tambem da clean architecture , mas pra sistemas mais complexos , até pra questao de clareza de codigo , escalabilidade e manutencao eu prefiro a hexagonal .. 


