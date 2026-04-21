# Quais foram as principais decisões de tratamento que você tomou? (ex.: o que fazer com registros órfãos, como normalizar cidades)

## Resposta: Optei por utilizar um inner join entre pedidos e clientes, e um left join entre esse resultado e entregas. Isso garante que não teremos um pedido sem cliente. IDs de entrega que não possuem correspondência em pedidos foram descartados, pois não há contexto de valor ou cliente para eles no relatório de performance. Para as cidades , utilizei a técnica de remoção de acentos via NFKD e conversão para maiúsculas (UPPER). Isso transforma "São Paulo" e "sao paulo" em "SAO PAULO", unificando a agregação.

--------------------------------------------------------------------------
# Seu pipeline é idempotente? Ou seja, rodá-lo duas vezes produz o mesmo resultado? Justifique.

## Resposta: Sim, o pipeline é idempotente. Como ele realiza leituras completas dos arquivos fonte e aplica transformações baseadas em regras lógicas fixas (e não em estados anteriores do banco de dados), rodá-lo uma ou dez vezes resultará sempre no mesmo arquivo CSV consolidado, assumindo que os dados de entrada não mudaram.

--------------------------------------------------------------------------

# Se esse pipeline fosse executado diariamente com arquivos de 10 milhões de linhas, o que você mudaria na abordagem?

## Resposta: Para arquivos desse volume, eu alteraria a abordagem da seguinte forma:

## - Uso de Spark ou Dask: O Pandas carrega tudo na memória RAM. Para 10 milhões de linhas, a RAM poderia esgotar. O Spark processaria isso de forma distribuída.

## - Formato Parquet: Em vez de CSV, usaria Parquet para armazenamento intermediário, pois ele é compactado e colunar, acelerando muito a leitura.

## - Processamento em Batches: Se fosse obrigado a usar Python puro, leria o CSV em chunks (pedaços de 100k linhas) para não sobrecarregar o sistema.

--------------------------------------------------------------------------

# Que testes você escreveria para garantir a qualidade das transformações?

## Resposta: Para garantir a saúde dos dados, eu escreveria testes para validar:

## - Esquema (Schema): Garantir que a coluna valor_total é sempre numérica.

## - Integridade: Testar se não existem valores de atraso_dias positivos onde o status_entrega indica "entregue no prazo".

## - Nulos: Validar se colunas críticas como id_pedido possuem zero valores nulos após o processamento.

## - Volume: Verificar se a soma dos valores totais no arquivo final bate com a soma do arquivo de origem (ajustada pelos filtros).