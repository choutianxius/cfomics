
#! Comparison的图,是对于一个entity,在所有疾病类型之间的比较。
#! 对于第一类数据,只需要一张图,因为一个基因对应表格中的一行。
#! 对于第二类数据,一个基因可能对应表格中的n行,因此需要选择其中一个来做图,详见原型。

import pandas as pd
from matplotlib.figure import Figure
import numpy as np
import matplotlib.cm as cm
from copy import copy
from .select_molecole_entity_value import select_molecule_entity_value
from statannotations.Annotator import Annotator
import matplotlib as mpl
import itertools
import matplotlib.pyplot as plt
import seaborn as sns
from .select_entity import select_entity
from .no_data_error import NoDataError, FeatureError

from os.path import dirname, abspath
plot_base = dirname(dirname(abspath(__file__)))
import sys
sys.path.insert(1, plot_base)
import beautify.beautify as beautify

def comparison_two(gene: str, feature: str, dataset:str, specimen: str, entity: str, disease1: str, disease2: str, conn, anentity=None) -> Figure:

    #! Comparison的图,是对于一个entity,在所有疾病类型之间的比较。
    #! 对于第一类数据,只需要一张图,因为一个基因对应表格中的一行。
    #! 对于第二类数据,一个基因可能对应表格中的n行,因此需要选择其中一个来做图,详见原型。
    """
    gene = 'ENSG00000141510' \\
    feature = 'dipseq' \\
    dataset = 'gse112679' \\
    specimen = 'plasma' \\
    entity = 'gene' \\
    disease1 = 'ct_hc' \\
    disease2 = 'ct_lc' \\
    anentity=None \\
    #!! 以前的设计中,对于第二类数据是一股脑地展示出所有entity(这里指具体的分子,是第二类表格中每一行,而不是gene,cgi)的comparison,在新的设计中,客户需要在网页中选择具体的entity来展示。
    #!候选的所有entities可以通过`select_entity()`函数获得
    anentity = 'SE|ENSG00000143514.16|TP53BP2|chr1|-|223792388|223792522|223789007|223789174|223793302|223793440' #此处值是范例,实际上需要根据网页决定
    # 如果是第一类数据,anentity取默认值None
    """
    # anentity = entities_to_select[0]

    molecule, value = select_molecule_entity_value(dataset, feature, specimen, entity, conn)

    diseases = [disease1,disease2]

    diseases_data = {}

    type = 0
    #查询数据
    if feature in ['altp','chim','edit','snp','splc','itst','apa']: #第二类数据
        type = 2
        for disease in diseases:
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
            fentities = list(temp['feature'])
            for fentity in fentities:
                if fentity not in diseases_data.keys():
                    diseases_data[fentity] = {}
                diseases_data[fentity][disease.upper()] = list(temp[temp['feature']==fentity].iloc[0,1:].replace({'NA':np.NaN}).fillna(0).astype('float')) #TODO 更好的na策略
    elif feature in ['bsseq','dipseq','fragsize','no','expr']: #第一类数据
        type = 1
        for disease in diseases:
            query_sql = f"""
                SELECT c.*
                FROM `{molecule}-{feature}-{dataset}-{entity}-{disease}-{specimen}-{value}` c, gene_index g
                WHERE c.feature LIKE CONCAT('%',g.ensembl_gene_id,'%')
                    AND g.ensembl_gene_id LIKE '%{gene}%'
            """
            temp = pd.read_sql_query(query_sql, conn) #选择某个疾病类型下的某个基因的所有样本的值,应当是1*n的矩阵
            try:
                diseases_data[disease.upper()] = list(temp.iloc[0,1:].replace({'NA':np.NaN}).fillna(0).astype('float')) #TODO 更好的na策略
            except IndexError:
                diseases_data[disease.upper()] = np.zeros(temp.shape[1],dtype='float')
    else:
        raise FeatureError(feature)

    if len(diseases_data) == 0:
        raise NoDataError(gene,feature,dataset)

    #!! 以前的设计中,对于第二类数据是一股脑地展示出所有entity的comparison,在新的设计中,客户需要在网页中选择具体的entity来展示。
    # entities_to_select = list(diseases_data.keys()) #这里展示出了所有候选的entity
    # anentity = entities_to_select[1]

    figsize = (10,4.5)
    #! 对于第二类数据,一个基因由于不同的疾病类型可能具有不同的entity数量。因此在上述查完数据之后,需要再根据查出来的数据来选择需要查看的entity
    if type == 2:
        # n_entities = len(diseases_data.keys())
        # anentity = list(diseases_data.keys())
        data_of_an_entity = diseases_data[anentity]

        #重整数据“
        data = pd.DataFrame(pd.DataFrame.from_dict(data_of_an_entity,orient='index').T.unstack())
        data = data.reset_index().drop(labels='level_1',axis=1).rename(columns={'level_0':'Diseases',0:'Value'}).dropna()
        data = beautify.beautify_table(data,reset_col=False)
        labels = list(data['Diseases'].unique())
        labels_combine = list(itertools.combinations(labels,2))
        #Boxplot
        fig = Figure(figsize=figsize)
        #ax = fig.subplots(n_entities,1)
        sns.set(style="whitegrid")
        ax = fig.add_subplot(1,1,1)
        plotfig = sns.boxplot(data=data, x='Diseases',y='Value',notch=False,ax=ax)
        sns.stripplot(data=data, x='Diseases',y='Value',ax=ax)

        ax.set_xlabel('Disease Conditions')
        ax.set_ylabel(f'{beautify.beautify(value)}')
        ax.set_xticklabels(labels,rotation=45)
        #ax.set_title(anentity,fontdict={'fontsize':8})
        # #Fill color
        # cmap = cm.ScalarMappable(cmap=mpl.cm.cool)
        # test_mean = [np.mean(x) for x in data]
        # for patch, color in zip(plotfig['boxes'], cmap.to_rgba(test_mean)):
        #     patch.set_facecolor(color)

        #统计注释
        if len(labels)>1:
            annot = Annotator(plotfig, labels_combine, data=data, x='Diseases',y='Value', order=labels)
            annot.configure(test='Mann-Whitney', loc='inside', verbose=2, text_format='star', line_height=0.02, line_offset=0.05, text_offset=0.04)
            annot.apply_test()
            ax, _ = annot.annotate()

        # fig.tight_layout()
        #return fig
    elif type == 1:

        #重整数据
        data = pd.DataFrame(pd.DataFrame.from_dict(diseases_data,orient='index').T.unstack())
        data = data.reset_index().drop(labels='level_1',axis=1).rename(columns={'level_0':'Diseases',0:'Value'}).dropna()
        data = beautify.beautify_table(data,reset_col=False)
        labels = list(data['Diseases'].unique())
        labels_combine = list(itertools.combinations(labels,2))
        #Boxplot
        fig = Figure(figsize=figsize)
        sns.set(style="whitegrid")
        ax = fig.add_subplot(1,1,1)
        plotfig = sns.boxplot(data=data, x='Diseases',y='Value',notch=False,ax=ax)
        sns.stripplot(data=data, x='Diseases',y='Value',ax=ax)

        ax.set_xlabel('Disease Conditions')
        ax.set_ylabel(f'{beautify.beautify(value)}')
        ax.set_xticklabels(labels,rotation=45)
        #ax.set_title(gene,fontdict={'fontsize':8})
        # #Fill color
        # cmap = cm.ScalarMappable(cmap=mpl.cm.cool)
        # test_mean = [np.mean(x) for x in data]
        # for patch, color in zip(plotfig['boxes'], cmap.to_rgba(test_mean)):
        #     patch.set_facecolor(color)

        #统计注释
        if len(labels)>1:
            annot = Annotator(plotfig, labels_combine, data=data, x='Diseases',y='Value', order=labels)
            annot.configure(test='Mann-Whitney', loc='inside', verbose=2, text_format='star', line_height=0.02, line_offset=0.05, text_offset=0.04)
            annot.apply_test()
            ax, _ = annot.annotate()
    fig.tight_layout()
    return fig