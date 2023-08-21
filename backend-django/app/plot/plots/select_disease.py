import pandas as pd

#用于comparison的疾病选项
def select_disease(dataset, feature, specimen, entity, conn):
    sql_molecule_entity_value = f"""
        SELECT *
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
            AND Specimen LIKE '%{specimen}%'
            AND Entity LIKE '%{entity}%'
            AND Disease_condition LIKE '%mean%'
    """

    tables = pd.read_sql_query(sql_molecule_entity_value,conn)
    name = '-'.join(tables.loc[0].tolist())
    sql = f"""
        SELECT *
        FROM `{name}`
        LIMIT 1
    """
    if feature in ['snp','edit','itst']:
        diseases = pd.read_sql_query(sql,conn).columns.tolist()[2:]
    else:
        diseases = pd.read_sql_query(sql,conn).columns.tolist()[1:]
    return diseases
