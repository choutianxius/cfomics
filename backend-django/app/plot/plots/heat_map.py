import pandas as pd
from .select_molecole_entity_value import select_molecule_entity_value
import dash_bio
import numpy as np
import plotly.express as px
from .no_data_error import NoDataError

from os.path import dirname, abspath
plot_base = dirname(dirname(abspath(__file__)))
import sys
sys.path.insert(1, plot_base)
import beautify.beautify as beautify

def heat_map(gene: str, feature: str, dataset: str, specimen: str, entity: str, conn):
	"""
	gene = 'ENSG00000000457' #基因主页所对应的基因 \\
	feature = 'altp' #此处值是范例，实际上需要根据网页决定 \\
	dataset = 'gse68086' #此处值是范例，实际上需要根据网页决定 \\
	specimen = 'tep' #此处值是范例，实际上需要根据网页决定 \\
	entity = 'entity'
	"""
	#以下变量由上述选择自动决定，因为具有关联性
	# molecule = 'cfrna'
	# entity = 'entity'
	# value = 'count'
	molecule, value = select_molecule_entity_value(dataset, feature, specimen, entity, conn)


	#根据以上条件查询所有可能的疾病类型
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
	diseases = pd.read_sql_query(sql_disease, conn)

	#查询语句
	diseases_data = pd.DataFrame()
	for disease in diseases['Disease_condition']:
		if feature=='chim':
			if dataset not in ['prjna737596','gse183635']:
				query_sql = f"""
					SELECT c.*
					FROM `{molecule}-{feature}-{dataset}-{entity}-{disease}-{specimen}-{value}` c, gene_index g
					WHERE c.feature LIKE CONCAT('%',g.hgnc_symbol,'|%')
						AND g.ensembl_gene_id LIKE '%{gene}%'
				"""
			else:
				query_sql = f"""
					SELECT c.*
					FROM `{molecule}-{feature}-{dataset}-{entity}-{disease}-{specimen}-{value}` c
					WHERE c.feature LIKE '%{gene}%'
				"""
		elif feature=='snp' or feature=='edit':
			query_sql = f"""
				SELECT c.*
				FROM `{molecule}-{feature}-{dataset}-{entity}-{disease}-{specimen}-{value}` c, gene_index g
				WHERE c.ensembl_gene_id LIKE CONCAT('%',g.ensembl_gene_id,'%')
					AND g.ensembl_gene_id LIKE '%{gene}%'
			"""
		elif feature=='itst':
			query_sql = f"""
				SELECT c.*
				FROM `{molecule}-{feature}-{dataset}-{entity}-{disease}-{specimen}-{value}` c, gene_index g
				WHERE c.gene_id LIKE CONCAT('%',g.ensembl_gene_id,'%')
					AND g.ensembl_gene_id LIKE '%{gene}%'
			"""
		else:
			query_sql = f"""
				SELECT c.*
				FROM `{molecule}-{feature}-{dataset}-{entity}-{disease}-{specimen}-{value}` c, gene_index g
				WHERE c.feature LIKE CONCAT('%',g.ensembl_gene_id,'%')
					AND g.ensembl_gene_id LIKE '%{gene}%'
			"""
		temp = pd.read_sql_query(query_sql, conn)
		if feature=='snp' or feature=='edit':
			temp = temp.drop(labels=['ensembl_gene_id'],axis=1)
		if feature=='itst':
			temp = temp.drop(labels=['gene_id'],axis=1).rename(columns={'protein_id':'feature'})
		temp = temp.set_index('feature').replace({'NA':np.NaN}).fillna(0).astype('float').mean(axis=1) #TODO 更好的na策略
		temp = temp.to_frame()
		temp.columns = [disease.upper()]
		diseases_data = pd.concat([diseases_data,temp],axis=1)
	if len(diseases_data) == 0:
		raise NoDataError(gene,feature,dataset)
	diseases_data = diseases_data.T
	diseases_data.columns.name = 'Entities'
	diseases_data = beautify.beautify_table(diseases_data.fillna(0))
	if diseases_data.shape[1] <= 1 or diseases_data.shape[0] <= 1: # no cluster
		fig = px.imshow(diseases_data.fillna(0),color_continuous_scale='Viridis').update_layout(autosize=False,
        width=1000,
        height=450,
        margin=dict(
            l=10,
            r=10,
            b=10,
            t=10,
            )
        )
	else: # cluster
		fig = dash_bio.Clustergram(data=diseases_data.fillna(0),line_width=1.5,color_map='Viridis',column_labels=list(diseases_data.columns),row_labels=list(diseases_data.index)
        ).update_xaxes(showticklabels=False
        ).update_layout(autosize=False,
        width=1000,
        height=450,
        margin=dict(
            l=10,
            r=10,
            b=10,
            t=10,
            )
        )
	return fig