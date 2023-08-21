import pandas as pd
from matplotlib.figure import Figure
import numpy as np
import matplotlib.cm as cm
import matplotlib as mpl
from .select_molecole_entity_value import select_molecule_entity_value
import seaborn as sns
from textwrap import wrap
import matplotlib.pyplot as plt

def table_bar(gene: str, feature: str, dataset: str, disease: str, specimen: str, entity: str, conn):
    """
    gene = 'ENSG00000000457' #基因主页所对应的基因 \\
    feature = 'altp' #此处值是范例，实际上需要根据网页决定 \\
    dataset = 'gse68086' #此处值是范例，实际上需要根据网页决定 \\
    disease = 'lihc' #此处值是范例，实际上需要根据网页决定 \\
    specimen = 'tep' #此处值是范例，实际上需要根据网页决定 \\
    entity = 'entity'
    """
    #以下变量由上述选择自动决定，因为具有关联性
    # molecule = 'cfrna'
    # entity = 'entity'
    # value = 'count'
    molecule, value = select_molecule_entity_value(dataset, feature, specimen, entity, conn)
    # sns.set_style('darkgrid')
    #查询语句
    query_sql = f"""
        SELECT c.*
        FROM `{molecule}-{feature}-{dataset}-{entity}-{disease}-{specimen}-{value}` c, gene_index g
        WHERE c.feature LIKE CONCAT('%',g.ensembl_gene_id,'%')
            AND g.ensembl_gene_id LIKE '%{gene}%'
    """

    #获得表格，可以直接在网页中展示
    table = pd.read_sql_query(query_sql, conn)
    table.iloc[:,1:] = table.iloc[:,1:].replace({'NA':'nan'}).fillna(0).astype('float') #TODO 更好的na策略
    table = table.set_index('feature') #feature列设为index

    #作图
    #将获得一个多行多列的表，每一行代表一个entity，每一列代表一个样本或一个疾病类型（当disease是mean时）。因此做barplot选择做dodged barplot (即grouped bat chart)。
    x = np.arange(table.shape[0]) #行数向量
    y = table.shape[1]
    fig = Figure()
    outtable = table.to_json()
    table = table.T
    entities = list(table.columns)
    table = table.reset_index()
    maxn = table.set_index('index').max().max()
    sns.set_theme()
    for i, anentity in zip(range(len(entities)),entities): #每一列，即每一个entity
        if i != len(entities)-1 and i != 0: #中间
            ax = plt.subplot(1,len(entities),i+1)
            sns.barplot(data=table, x='index', y=anentity,ax=ax)
            ax.set_xticklabels('')
            ax.set_ylim(0,maxn)
            ax.set_xlabel('')
            ax.set_yticklabels('')
            ax.set_ylabel('')
        elif i == 0: #开头
            ax = plt.subplot(1,len(entities),i+1)
            sns.barplot(data=table, x='index', y=anentity,ax=ax)
            ax.set_xticklabels('')
            ax.set_ylim(0,maxn)
            ax.set_xlabel('')
            ax.set_ylabel(value.upper())
        else: #末尾
            ax = plt.subplot(1,len(entities),i+1)
            sns.barplot(data=table, x='index', y=anentity,hue='index',ax=ax)
            ax.set_xticklabels('')
            ax.set_ylim(0,maxn)
            ax.set_xlabel('')
            ax.set_ylabel('')
            ax.set_yticklabels('')
        ax.set_title('\n'.join(wrap(anentity,20)),fontdict={'fontsize':7,'horizontalalignment':'center'})

    ax.legend(loc='center left', bbox_to_anchor=(1, 0.5),fontsize=7)
    plt.tight_layout()
    return fig, outtable