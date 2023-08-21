import pandas as pd
import numpy as np
import plotly.express as px

from os.path import dirname, abspath
plot_base = dirname(dirname(abspath(__file__)))
import sys
sys.path.insert(1, plot_base)
import beautify.beautify as beautify
from .no_data_error import NoPairError

def select_table(feature1, feature2, specimen, conn): #选择两个feature，这个specimen下所有可能的表格
    sql_table = f"""
		SELECT ori.*
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
			AND Specimen LIKE '%{specimen}%'
			AND Disease_condition NOT LIKE '%mean%'
            AND (Entity LIKE '%gene%'
                OR Entity LIKE '%15t5%'
                OR Entity LIKE '%31e1%'
                OR Entity LIKE '%entity%'
                OR Entity LIKE '%promoter%')
	"""
    return pd.read_sql_query(sql_table,conn)

# 寻找两feature，一个specimen下共有的疾病类型
def common_disease(tables, feature1, feature2):
    disease_feature1 = tables[tables['Omics']==feature1]['Disease_condition'].unique().tolist()
    disease_feature2 = tables[tables['Omics']==feature2]['Disease_condition'].unique().tolist()
    diseases = list(set(disease_feature1).intersection(disease_feature2))
    return diseases, tables[tables['Disease_condition'].isin(diseases)]

def select_data(gene: str, table_name: list, conn) -> str:
    feature = table_name[1]
    dataset = table_name[2]
    table_name = f'{table_name[0]}-{table_name[1]}-{table_name[2]}-{table_name[3]}-{table_name[4]}-{table_name[5]}-{table_name[6]}'
    if feature=='chim':
        if dataset not in ['prjna737596','gse183635']:
            query_sql = f"""
                SELECT c.*
                FROM `{table_name}` c, gene_index g
                WHERE c.feature LIKE CONCAT('%',g.hgnc_symbol,'|%')
                    AND g.ensembl_gene_id LIKE '%{gene}%'
            """
        else:
            query_sql = f"""
                SELECT c.*
                FROM `{table_name}` c
                WHERE c.feature LIKE '%{gene}%'
            """
    elif feature=='snp' or feature=='edit':
        query_sql = f"""
            SELECT c.*
            FROM `{table_name}` c
            WHERE c.ensembl_gene_id LIKE '%{gene}%'
        """
    elif feature=='itst':
        query_sql = f"""
            SELECT c.*
            FROM `{table_name}` c, gene_index g
            WHERE c.gene_id LIKE CONCAT('%',g.ensembl_gene_id,'%')
                AND g.ensembl_gene_id LIKE '%{gene}%'
        """
    else:
        query_sql = f"""
            SELECT c.*
            FROM `{table_name}` c, gene_index g
            WHERE c.feature LIKE CONCAT('%',g.ensembl_gene_id,'%')
                AND g.ensembl_gene_id LIKE '%{gene}%'
        """
    data = pd.read_sql_query(query_sql, conn, dtype=str)
    # if len(data) == 0:
    #     raise NoPairError()

    if feature not in ['snp','edit','itst']:
        thelist = data.iloc[:,1:].replace('NA','0').astype(float).mean(axis=0).tolist()
    else:
        thelist = data.iloc[:,2:].replace('NA','0').astype(float).mean(axis=0).tolist()
    return thelist

#* feature1,2的entity可以通过select_entity.select_feature_entity(feature,conn)来查找
def scatter(gene, feature1, feature2, specimen, feature1_entity, feature2_entity, conn):
    tables = select_table(feature1,feature2,specimen,conn)
    if len(list(tables['Omics'].unique())) < 2:
        raise NoPairError() #理论上不会报错，因为specimen选项已经提前通过select_specimen()进行选择了
    diseases, tables = common_disease(tables, feature1, feature2) #共有的疾病类型以及对应表格
    if len(diseases) == 0:
        raise NoPairError()
    data = {}
    for disease in diseases:
        data[disease] = {}
        tables_disease = tables[tables['Disease_condition']==disease]
        for feature, feature_entity in zip([feature1, feature2],[feature1_entity, feature2_entity]):
            tables_disease_feature = tables_disease[(tables_disease['Omics']==feature) & (tables_disease['Entity']==feature_entity)]
            # assert tables_disease_feature.shape[0]<=1, tables_disease_feature
            table_name = tables_disease_feature.iloc[0,:].tolist()
            data_of_table = select_data(gene, table_name, conn)
            data[disease][feature] = data_of_table
    df = pd.DataFrame(columns=[feature1,feature2,'disease'])
    for disease in data:
        feature1_data = data[disease][feature1]
        feature2_data = data[disease][feature2]
        lenmin = min(len(feature1_data),len(feature2_data))
        feature_data = (list(t) for t in zip(feature1_data,feature2_data,[disease]*lenmin))
        dftemp = pd.DataFrame(feature_data,columns=[feature1,feature2,'disease'])
        df = pd.concat([df,dftemp],ignore_index=True).set_index('disease').replace({'NA':np.NaN}).fillna(0).astype('float').reset_index()
    df = beautify.beautify_table(df)
    if feature1_entity != 'entity':
        xlabel = beautify.beautify(feature1) + f'<br>({beautify.beautify(feature1_entity)})'
    else:
        xlabel = beautify.beautify(feature1)
    if feature2_entity != 'entity':
        ylabel = beautify.beautify(feature2) + f'<br>({beautify.beautify(feature2_entity)})'
    else:
        ylabel = beautify.beautify(feature2)
    fig = px.scatter(df,
            x=beautify.beautify(feature1),
            y=beautify.beautify(feature2),
            trendline="ols",
            color='disease',
            marginal_x="histogram",
            marginal_y="histogram",
            labels = {
                'disease': 'Diseases',
                beautify.beautify(feature1): xlabel,
                beautify.beautify(feature2): ylabel
            }
        ).update_layout(autosize=False,
        width=800,
        height=450,
        margin=dict(
            l=10,
            r=10,
            b=10,
            t=10,
            )
        )

    return fig