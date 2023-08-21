import pandas as pd


def get_entity_id_from_microbe(microbe: str, conn):
    """
    microbe = '203693|Nitrospira'
    Return: entity, taxo_id
    """
    sql_query = f"""
        SELECT taxo, taxo_id
        FROM microbe_taxo
        WHERE feature LIKE '%{microbe}%'
    """
    df = pd.read_sql_query(sql_query, conn)
    return df['taxo'][0], df['taxo_id'][0]
