
#! 需要注意的是, boxplot在设计中有2种形式, 即一般的boxplot和堆叠的boxplot。具体设计在「数据展示形式」ppt中有。
#* 这里的代码是堆叠的batplot，适用于Alt.promoter, Chimeric RNA, Editing, Splicing（第二类数据）

import pandas as pd
from .select_molecole_entity_value import select_molecule_entity_value
import plotly.express as px
import numpy as np
from .no_data_error import NoDataError

from os.path import dirname, abspath
plot_base = dirname(dirname(abspath(__file__)))
import sys
sys.path.insert(1, plot_base)
import beautify.beautify as beautify

def stack_box(gene: str, feature: str, dataset: str, specimen: str, entity: str, conn):
	"""
	gene = 'ENSG00000000457' #基因主页所对应的基因 \\
	feature = 'altp' #此处值是范例，实际上需要根据网页决定 \\
	dataset = 'gse68086' #此处值是范例，实际上需要根据网页决定 \\
	specimen = 'tep' #此处值是范例，实际上需要根据网页决定\\
	entity = 'entity' \\
	conn:建立的mysql连接
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
			AND ENtity LIKE '%{entity}%'
			AND Disease_condition NOT LIKE '%mean%'
	"""
	diseases = pd.read_sql_query(sql_disease, conn)

	#查询语句
	diseases_data = {}
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
		temp = pd.read_sql_query(query_sql, conn) #选择某个疾病类型下的某个基因的所有样本的值，应当是1*n的矩阵
		if feature=='snp' or feature=='edit':
			temp = temp.drop(labels=['ensembl_gene_id'],axis=1)
		if feature=='itst':
			temp = temp.drop(labels=['gene_id'],axis=1).rename(columns={'protein_id':'feature'})
		fentities = list(temp['feature'])
		for fentity in fentities:
			if fentity not in diseases_data.keys():
				diseases_data[fentity] = {}
			diseases_data[fentity][disease.upper()] = list(temp[temp['feature']==fentity].iloc[0,1:].replace({'NA':np.NaN}).fillna(0).astype('float')) #TODO 更好的策略
	if len(diseases_data) == 0:
		raise NoDataError(gene,feature,dataset)
	#作图
	#将获得一个多行多列的表，每一行代表一个entity，每一列代表一个样本或一个疾病类型（当disease是mean时）。因此做barplot选择做dodged barplot (即grouped bat chart)。
	features, out_data = diseases_data.keys(), diseases_data.values()
	dff = pd.DataFrame()
	for anentity in diseases_data.keys():
		for an_anentity in diseases_data[anentity].keys():
			dff = dff.append([[anentity,an_anentity,x] for x in diseases_data[anentity][an_anentity]])
	dff.columns = ['anentity','Diseases','Value']
	dff = beautify.beautify_table(dff,reset_col=False)
	fig = px.box(dff, x="Diseases", y="Value", color='anentity',labels={'Disease':'Disease Conditions','Value':beautify.beautify(value)})
	fig.update_layout(
        boxmode='overlay',
        legend=dict(
            orientation="h",
            itemwidth=30,
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1
        ),legend_font_size=6,legend_title='Entity',
        autosize=False,
        width=1000,
        height=450,
        margin=dict(
            l=10,
            r=10,
            b=10,
            t=10,
        )
    )
	fig.update_traces(quartilemethod="exclusive")
	return fig