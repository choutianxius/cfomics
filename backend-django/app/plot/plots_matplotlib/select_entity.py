import pandas as pd
from .select_molecole_entity_value import select_molecule_entity_value
def select_entity(gene, dataset, feature, specimen, entity, conn):
    sql_disease = f"""
        SELECT ori.Disease_condition
        FROM (
            SELECT SUBSTRING_INDEX(TABLE_NAME,'-',1) AS NT,
                SUBSTRING_INDEX(SUBSTRING_INDEX(TABLE_NAME,'-',-6),'-',1) AS Omics,
                SUBSTRING_INDEX(SUBSTRING_INDEX(TABLE_NAME,'-',-5),'-',1) AS Dataset,
                SUBSTRING_INDEX(SUBSTRING_INDEX(TABLE_NAME,'-',-4),'-',1) AS Entity,
                SUBSTRING_INDEX(SUBSTRING_INDEX(TABLE_NAME,'-',-3),'-',1) AS Disease_condition,
                SUBSTRING_INDEX(SUBSTRING_INDEX(TABLE_NAME,'-',-2),'-',1) AS Specimen,
                SUBSTRING_INDEX(TABLE_NAME,'-',-1) AS Value_type
            FROM information_schema.`TABLES`
            WHERE table_schema='exOmics'
                AND (
                    TABLE_NAME LIKE '%gse%'
                    OR TABLE_NAME LIKE '%prjeb%'
                    OR TABLE_NAME LIKE '%prjna%'
                    OR TABLE_NAME LIKE '%gse%'
                    OR TABLE_NAME LIKE '%srp%'
                    OR TABLE_NAME LIKE '%pxd%'
                )
                AND TABLE_NAME NOT LIKE '%gsea%'
            )ori
        WHERE Dataset LIKE '%{dataset}%'
            AND Omics LIKE '%{feature}%'
            AND Entity LIKE '%{entity}%'
            AND Disease_condition NOT LIKE '%mean%'
    """
    molecule, value = select_molecule_entity_value(dataset, feature, specimen, entity, conn)
    diseases = pd.read_sql_query(sql_disease, conn)
    diseases_data = {}
    for disease in diseases['Disease_condition']:
        query_sql = f"""
            SELECT c.*
            FROM `{molecule}-{feature}-{dataset}-{entity}-{disease}-{specimen}-{value}` c, gene_index g
            WHERE c.feature LIKE CONCAT('%',g.ensembl_gene_id,'%')
                AND g.ensembl_gene_id LIKE '%{gene}%'
        """
        temp = pd.read_sql_query(query_sql, conn) #选择某个疾病类型下的某个基因的所有样本的值，应当是1*n的矩阵
        fentities = list(temp['feature'])
        for fentity in fentities:
            if fentity not in diseases_data.keys():
                diseases_data[fentity] = {}
            diseases_data[fentity][disease.upper()] = list(temp[temp['feature']==fentity].iloc[0,1:].astype('float'))
    entities_to_select = list(diseases_data.keys()) #这里展示出了所有候选的entity

    return entities_to_select
# TODO 改成表格的格式，不再每次都查询了