import pandas as pd
import numpy as np
from .select_molecole_entity_value import select_molecule_entity_value
import plotly.express as px
from .no_data_error import NoDataError
from textwrap import wrap

from os.path import dirname, abspath
plot_base = dirname(dirname(abspath(__file__)))
import sys
sys.path.insert(1, plot_base)
import beautify.beautify as beautify

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

    #获得表格，可以直接在网页中展示
    table = pd.read_sql_query(query_sql, conn)
    if len(table) == 0:
        raise NoDataError(gene,feature,dataset)
    if feature=='snp' or feature=='edit':
        table = table.drop(labels=['ensembl_gene_id'],axis=1)
    if feature=='itst':
        table = table.drop(labels=['gene_id'],axis=1).rename(columns={'protein_id':'feature'})
    table.iloc[:,1:] = table.iloc[:,1:].replace({'NA':np.NaN}).fillna(0).astype('float') #TODO 更好的na策略
    table = table.set_index('feature') #feature列设为index

    #作图
    #将获得一个多行多列的表，每一行代表一个entity，每一列代表一个样本或一个疾病类型（当disease是mean时）。因此做barplot选择做dodged barplot (即grouped bat chart)。
    x = np.arange(table.shape[0]) #行数向量
    y = table.shape[1]
    outtable = table.to_json()
    table = table.T
    entities = list(table.columns)
    table = table.reset_index()
    maxn = table.set_index('index').max().max()
    table = pd.melt(table, id_vars=['index'], value_vars=entities)
    table['feature'] = table['feature'].apply(lambda l: '<br>'.join(wrap(l, 30)))
    table = beautify.beautify_table(table)
    fig = px.bar(table, x="feature", y="value", color="index",barmode = 'group',
            # facet_col="feature",facet_col_spacing=(1/(len(table['feature'].unique())-1)),
            labels={
                'value':beautify.beautify(value),
                'index':'Samples',
                'feature' : 'Entities'
            }
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
    return fig, outtable