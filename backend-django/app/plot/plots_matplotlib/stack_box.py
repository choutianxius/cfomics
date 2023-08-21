
#! 需要注意的是, boxplot在设计中有2种形式, 即一般的boxplot和堆叠的boxplot。具体设计在「数据展示形式」ppt中有。
#* 这里的代码是堆叠的batplot，适用于Alt.promoter, Chimeric RNA, Editing, Splicing（第二类数据）

import pandas as pd
from matplotlib.figure import Figure
import numpy as np
import matplotlib.cm as cm
from copy import copy
from .select_molecole_entity_value import select_molecule_entity_value
import seaborn as sns

def stack_box(gene: str, feature: str, dataset: str, specimen: str, entity: str, conn) -> Figure:
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
	sns.set_theme()
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
			diseases_data[fentity][disease.upper()] = list(temp[temp['feature']==fentity].iloc[0,1:].replace({'NA':'nan'}).fillna(0).astype('float')) #TODO 更好的策略

	#作图
	#将获得一个多行多列的表，每一行代表一个entity，每一列代表一个样本或一个疾病类型（当disease是mean时）。因此做barplot选择做dodged barplot (即grouped bat chart)。
	features, out_data = diseases_data.keys(), diseases_data.values()
	fig = Figure()
	ax = fig.subplots()
	cmap = cm.get_cmap('viridis',len(features))
	colors = cmap(np.linspace(0, 1, len(features)))
	colors[:,-1] = 0.5
	elements = []
	for i in range(len(features)): #对于每个entity
		feature = list(features)[i]
		labels, data = diseases_data[feature].keys(), diseases_data[feature].values()
		color = colors[i,:]
		color_notrans = copy(color)
		color_notrans[-1] = 1
		elements.append(ax.boxplot(data,
			notch=False,
			patch_artist=True,
			labels=labels,
			boxprops={'facecolor':color,'edgecolor':color_notrans},
			flierprops={'marker':'.', 'markerfacecolor': color, 'markeredgecolor': color_notrans},
			medianprops = {'color': color_notrans},
			capprops={'color':color_notrans},
			whiskerprops={'color':color_notrans}))
		ax.set_xlabel('Disease Conditions')
		ax.set_ylabel(f'{value.upper()}')
	colors_notrans = copy(colors)
	colors_notrans[:,-1] = 1
	ax.legend([element["boxes"][0] for element in elements],
		[list(features)[idx] for idx in range(len(features))],
		bbox_to_anchor=(0,1.02,1,1),
		loc='lower left',
		mode='expand',
		borderaxespad=0,
		fontsize=5
	)
	fig.tight_layout()
	return fig
