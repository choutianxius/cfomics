
#* 返回两个feature共有的specimen，可供网页中进行选择
import pandas as pd

def select_specimen(feature1, feature2, conn):
    sql_table = f"""
		SELECT ori.Specimen
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
		WHERE (Omics LIKE '%{feature1}%' OR Omics LIKE '%{feature2}%')
			AND Disease_condition NOT LIKE '%mean%'
            AND (Entity LIKE '%gene%'
                OR Entity LIKE '%15t5%'
                OR Entity LIKE '%31e1%'
                OR Entity LIKE '%entity%'
                OR Entity LIKE '%promoter%')
	"""
    return pd.read_sql_query(sql_table, conn)['Specimen'].unique().tolist()