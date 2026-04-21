import pandas as pd
import numpy as np
from datetime import datetime

def display(value):
    print(value)
    print("-" * 30)

def generate_mock_data():
    # Expandindo a base de pedidos
    pedidos = pd.DataFrame({
        'id_pedido': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        'data_pedido': ['2023-01-01', '02/01/2023', '2023-01-03', '2023-01-04', '2023-01-05', 
                        '2023-01-06', '2023-01-07', '2023-01-08', '2023-01-09', '2023-01-10'],
        'id_cliente': [101, 102, 103, 104, 101, 105, 102, 106, 101, 107],
        'valor_total': ['100,50', '200.00', '150,00', '320,00', '50,00', 
                        '450,10', '120,00', '99,90', '210,00', '300,00'],
        'status': ['pago', 'pago', 'pendente', 'pago', 'pago', 'cancelado', 'pago', 'pago', 'pago', 'pago']
    })
    
    # Expandindo a base de clientes com mais cidades
    clientes = pd.DataFrame({
        'id_cliente': [101, 102, 103, 104, 105, 106, 107],
        'nome': ['Ana Silva', 'Bruno Souza', 'Carla Dias', 'Diego Lima', 'Elena Rosa', 'Fabio Junior', 'Gisele Bündchen'],
        'cidade': ['São Paulo', 'sao paulo', 'CURITIBA', 'Rio de Janeiro', 'SAO PAULO', 'Curitiba', 'Belo Horizonte'],
        'estado': ['SP', 'SP', 'PR', 'RJ', 'SP', 'PR', 'MG'],
        'data_cadastro': ['2022-01-01'] * 7
    })
    
    # Expandindo a base de entregas
    entregas = pd.DataFrame({
        'id_entrega': [501, 502, 503, 504, 505, 506, 507, 508],
        'id_pedido': [1, 2, 3, 4, 5, 7, 8, 10],
        'data_prevista': ['2023-01-05', '2023-01-05', '2023-01-10', '2023-01-10', 
                          '2023-01-12', '2023-01-15', '2023-01-15', '2023-01-20'],
        'data_realizada': ['2023-01-06', '2023-01-04', None, '2023-01-12', 
                           '2023-01-12', '2023-01-14', '2023-01-18', '2023-01-20'],
        'status_entrega': ['entregue', 'entregue', 'em transito', 'entregue', 
                           'entregue', 'entregue', 'entregue', 'entregue']
    })
    return pedidos, clientes, entregas

def run_pipeline():
    df_p, df_c, df_e = generate_mock_data()

    # Faz o coerce na data pra ficar certinho
    df_p['data_pedido'] = pd.to_datetime(df_p['data_pedido'], errors='coerce')

    # Converte o valor total pra float, tratando a vírgula como separador decimal
    df_p['valor_total'] = df_p['valor_total'].str.replace(',', '.').astype(float)

    # Remove linhas com id_pedido ou valor_total faltando
    df_p = df_p.dropna(subset=['id_pedido', 'valor_total'])

    # Normaliza a cidade (removendo acentos, convertendo para maiúsculas e removendo espaços) [diacrits]
    df_c['cidade_normalizada'] = df_c['cidade'].str.strip().str.normalize('NFKD')\
        .str.encode('ascii', errors='ignore').str.decode('utf-8').str.upper()

    # Converte as datas de entrega e realizacao da entrega, tratando erros
    df_e['data_prevista'] = pd.to_datetime(df_e['data_prevista'], errors='coerce')
    df_e['data_realizada'] = pd.to_datetime(df_e['data_realizada'], errors='coerce')

    # Realiza os merges para consolidar os dados
    df_consolidado = pd.merge(df_p, df_c, on='id_cliente', how='inner')

    # Merge com entregas usando left join para manter todos os pedidos, mesmo os sem entrega
    df_consolidado = pd.merge(df_consolidado, df_e, on='id_pedido', how='left')

    # Calcula o atraso em dias (data_realizada - data_prevista)
    df_consolidado['atraso_dias'] = (df_consolidado['data_realizada'] - df_consolidado['data_prevista']).dt.days

    colunas_finais = [
        'id_pedido', 'nome', 'cidade_normalizada', 'estado', 'valor_total', 
        'status', 'data_pedido', 'data_prevista', 'data_realizada', 'atraso_dias', 'status_entrega'
    ]
    df_final = df_consolidado[colunas_finais]

    display("### INDICADORES CONSOLIDADOS ###")
    
    display("Total de Pedidos por Status:")
    print(df_final['status'].value_counts())
    
    display("Ticket Médio por Estado:")
    print(df_final.groupby('estado')['valor_total'].mean().map('R$ {:,.2f}'.format))

    display("Top 3 Cidades com maior volume de pedidos:")
    top_cidades = df_final['cidade_normalizada'].value_counts().head(3)
    print(top_cidades)

    entregues = df_final.dropna(subset=['atraso_dias'])
    if not entregues.empty:
        no_prazo = (entregues['atraso_dias'] <= 0).sum()
        com_atraso = (entregues['atraso_dias'] > 0).sum()
        total_entregue = len(entregues)
        
        display("Performance de Entrega:")
        print(f"Percentual no Prazo: {(no_prazo/total_entregue)*100:.2f}%")
        print(f"Percentual com Atraso: {(com_atraso/total_entregue)*100:.2f}%")
        
        media_atraso = entregues[entregues['atraso_dias'] > 0]['atraso_dias'].mean()
        if pd.notnull(media_atraso):
            print(f"Média de dias de atraso (somente atrasados): {media_atraso:.2f} dias")

    return df_final

if __name__ == "__main__":
    resultado = run_pipeline()
    resultado.to_csv('relatorio_consolidado.csv', index=False)
    print("\nRelatório exportado com sucesso: relatorio_consolidado.csv")