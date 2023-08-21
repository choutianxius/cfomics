#! 需要注意的是, boxplot在设计中有2种形式, 即一般的boxplot和堆叠的boxplot。具体设计在「数据展示形式」ppt中有。

#* 这里的代码是非堆叠的batplot，适用于Alt.polyadenylation, BS-seq, DIP-seq, Fragment size, NO, Expression（第一类数据）

import pandas as pd
import numpy as np
from .select_molecole_entity_value import select_molecule_entity_value
import plotly.express as px
from .no_data_error import NoDataError

from os.path import dirname, abspath
plot_base = dirname(dirname(abspath(__file__)))
import sys
sys.path.insert(1, plot_base)
import beautify.beautify as beautify

def non_stack_box(gene: str, feature: str, dataset: str, specimen: str, entity: str, conn):
	"""
	gene = 'ENSG00000001629' #基因主页所对应的基因 \\
	feature = 'expr' #此处值是范例，实际上需要根据网页决定 \\
	dataset = 'gse133684' #此处值是范例，实际上需要根据网页决定 \\
	specimen = 'ev' #此处值是范例，实际上需要根据网页决定 \\
	entity = 'gene'
	"""
	#以下变量由上述选择自动决定，因为具有关联性
	# molecule = 'cfrna'
	# entity = 'gene'
	# value = 'tpm'
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
	diseases_data = {}
	for disease in diseases['Disease_condition']:
		query_sql = f"""
			SELECT c.*
			FROM `{molecule}-{feature}-{dataset}-{entity}-{disease}-{specimen}-{value}` c, gene_index g
			WHERE c.feature LIKE CONCAT('%',g.ensembl_gene_id,'%')
				AND g.ensembl_gene_id LIKE '%{gene}%'
		"""
		temp = pd.read_sql_query(query_sql, conn) #选择某个疾病类型下的某个基因的所有样本的值，应当是1*n的矩阵
		try:
			diseases_data[disease.upper()] = list(temp.iloc[0,1:].replace({'NA':np.NaN}).fillna(0).astype('float')) #TODO 更好的na策略
		except IndexError:
			diseases_data[disease.upper()] = np.zeros(temp.shape[1],dtype='float')

	if len(diseases_data) == 0:
			raise NoDataError(gene,feature,dataset)
	#作图
	#将获得一个多行多列的表，每一行代表一个entity，每一列代表一个样本或一个疾病类型（当disease是mean时）。因此做barplot选择做dodged barplot (即grouped bat chart)。


	#labels, data = diseases_data.keys(), diseases_data.values() #Drawing data

	data = pd.DataFrame(pd.DataFrame.from_dict(diseases_data,orient='index').T.unstack())
	data = data.reset_index().drop(labels='level_1',axis=1).rename(columns={'level_0':'Diseases',0:'Value'}).dropna()
	data = beautify.beautify_table(data,reset_col=False)
	fig = px.box(data,x='Diseases',y='Value',color='Diseases',
	labels={'Value':beautify.beautify(value)})
	fig.update_traces(quartilemethod="exclusive")
	fig.update_layout(
        legend=dict(
            orientation="h",
            # entrywidth=70,
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1
        ),autosize=False,
        width=1000,
        height=450,
        margin=dict(
            l=10,
            r=10,
            b=10,
            t=10
        )
    )
	return fig