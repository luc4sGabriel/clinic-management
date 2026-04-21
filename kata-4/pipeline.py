import pandas as pd
import numpy as np
from datetime import datetime

def generate_mock_data():
    pedidos = pd.DataFrame({
        'id_pedido': [1, 2, 3, 4],
        'data_pedido': ['2023-01-01', '02/01/2023', '2023-01-03 10:00:00', '2023-01-04'],
        'id_cliente': [101, 102, 103, 104],
        'valor_total': ['100,50', '200.00', '150,00', None],
        'status': ['pago', 'pago', 'pendente', 'pago']
    })
    
    clientes = pd.DataFrame({
        'id_cliente': [101, 102, 103],
        'nome': ['Ana Silva', 'Bruno Souza', 'Carla Dias'],
        'cidade': ['São Paulo', 'sao paulo', 'CURITIBA'],
        'estado': ['SP', 'SP', 'PR'],
        'data_cadastro': ['2022-01-01', '2022-01-01', '2022-01-01']
    })
    
    entregas = pd.DataFrame({
        'id_entrega': [501, 502, 503, 504],
        'id_pedido': [1, 2, 99, 3],
        'data_prevista': ['2023-01-05', '2023-01-05', '2023-01-05', '2023-01-05'],
        'data_realizada': ['2023-01-06', '2023-01-04', '2023-01-05', None],
        'status_entrega': ['entregue', 'entregue', 'erro', 'em transito']
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

    # Realiza os merges para consolidar os dadosa
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

    print("### INDICADORES CONSOLIDADOS ###")
    print(f"\nTotal por Status:\n{df_final['status'].value_counts()}")
    print(f"\nTicket Médio por Estado:\n{df_final.groupby('estado')['valor_total'].mean()}")
    
    entregues = df_final.dropna(subset=['atraso_dias'])
    no_prazo = (entregues['atraso_dias'] <= 0).sum()
    com_atraso = (entregues['atraso_dias'] > 0).sum()
    total_entregue = len(entregues)
    
    if total_entregue > 0:
        print(f"\nPercentual no Prazo: {(no_prazo/total_entregue)*100:.2f}%")
        print(f"Percentual com Atraso: {(com_atraso/total_entregue)*100:.2f}%")
        print(f"Média de dias de atraso (pedidos atrasados): {entregues[entregues['atraso_dias'] > 0]['atraso_dias'].mean():.2f}")

    return df_final

if __name__ == "__main__":
    resultado = run_pipeline()
    resultado.to_csv('relatorio_consolidado.csv', index=False)