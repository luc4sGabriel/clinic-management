# Quais foram as principais decisões de tratamento que você tomou? (ex.: o que fazer com registros órfãos, como normalizar cidades)

## Resposta: A estratégia principal foi o uso de joins: mandei um inner join entre pedidos e clientes e um left join com a tabela de entregas. A ideia aqui é garantir que nenhum pedido fique "voando" sem um cliente dono. No caso dos IDs de entrega que não batiam com nenhum pedido, preferi descartar, já que eles perdem o sentido (valor e contexto) pro relatório de performance. Para as cidades, dei uma limpada geral: usei o NFKD para tirar os acentos e joguei tudo pra maiúsculo (UPPER). Assim, "São Paulo" e "sao paulo" viram a mesma coisa e a conta fecha certinho na hora de agrupar.


# Seu pipeline é idempotente? Ou seja, rodá-lo duas vezes produz o mesmo resultado? Justifique.

## Resposta: Sim, o pipeline é totalmente idempotente. Ele trabalha lendo os arquivos fonte do zero e aplica regras lógicas que não dependem de nada que já aconteceu antes ou de estados de banco de dados. Então, não importa se você rodar uma ou dez vezes: se os dados de entrada forem os mesmos, o CSV final vai ser exatamente o mesmo, sem duplicar ou mudar nada.



# Se esse pipeline fosse executado diariamente com arquivos de 10 milhões de linhas, o que você mudaria na abordagem?

## Resposta: Com 10 milhões de linhas o buraco é mais embaixo e eu mudaria algumas coisas:

## - Uso de Spark ou Dask: O Pandas carrega tudo na RAM de uma vez, e com esse volume o sistema ia travar com certeza. O Spark resolveria isso processando em paralelo.

## - Formato Parquet: Abandonaria o CSV e usaria Parquet pros arquivos intermediários. Por ser colunar e compactado, ele é infinitamente mais rápido pra ler e escrever.

## - Processamento em Chunks: Se eu tivesse que me manter só no Python, a saída seria ler o CSV em pedaços (chunks de 100k linhas, por exemplo) pra conseguir processar sem estourar a memória da máquina.



# Que testes você escreveria para garantir a qualidade das transformações?

## Resposta: Pra dormir tranquilo e garantir que os dados estão certos, eu focaria nesses testes:

## - Validação de Schema: Conferir se a coluna valor_total é realmente um número e não apareceu nenhuma string perdida lá.

## - Teste de Integridade: Cruzar os dados pra garantir que não tem nenhum "atraso positivo" em pedidos que o status tá marcado como "entregue no prazo".

## - Checagem de Nulos: Ver se colunas vitais, como o id_pedido, não ficaram com valores vazios depois que o processamento passou.

## - Batimento de Volume: Um teste simples pra ver se o valor total somado no arquivo final bate com a soma do arquivo bruto que entrou (descontando o que foi filtrado).