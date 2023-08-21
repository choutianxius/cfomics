from .no_data_error import NoBiomarkerError
import pandas as pd
import pymysql

def biomarker_search(gene: str,conn):
    """
    gene = "ENSG00000283844" 示例
    """
    query = f"""
        SELECT DISTINCT a.*
        FROM `all-biomarkers` a, gene_index g
        WHERE g.ensembl_gene_id LIKE '%{gene}%'
            AND a.marker_name LIKE g.hgnc_symbol
    """

    query_mir = f"""
        SELECT DISTINCT *
        FROM `all-biomarkers` a, mirna_index m
        WHERE m.ensembl_gene_id LIKE '%{gene}%' AND
            a.marker_name LIKE CONCAT("%",m.mir_id,"%")
    """

    df = pd.read_sql_query(query,conn)
    if len(df) == 0:
        df = pd.read_sql_query(query_mir,conn)
    if len(df) == 0:
        raise NoBiomarkerError(gene)
    return df.to_json()