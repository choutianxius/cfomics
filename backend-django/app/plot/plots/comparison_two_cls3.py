
#! 仅适用于第三类数据
import pandas as pd
from matplotlib.figure import Figure
import numpy as np
from .select_molecole_entity_value import select_molecule_entity_value
from statannotations.Annotator import Annotator
import itertools
import seaborn as sns
from .get_entity_id_from_microbe import get_entity_id_from_microbe
from .no_data_error import NoDataError

from os.path import dirname, abspath
plot_base = dirname(dirname(abspath(__file__)))
import sys
sys.path.insert(1, plot_base)
import beautify.beautify as beautify

def comparison_two_cls3(motif: str, feature: str, dataset: str, specimen: str, disease1: str, disease2: str, conn, entity='4mer') -> Figure:
### endmotif or microbe
    """
    motif = '117743|Flavobacteriia' #motif或microbe \\
    feature = 'microbe' #此处值是范例，实际上需要根据网页决定 \\
    dataset = 'gse81314' #此处值是范例，实际上需要根据网页决定 \\
    specimen = 'plasma' #此处值是范例，实际上需要根据网页决定
    entity #如果是微生物数据,此项随意;如果是motif数据,此项取默认值
    """
    if feature=='microbe':
        entity, _ = get_entity_id_from_microbe(motif, conn)
    molecule, value = select_molecule_entity_value(dataset, feature, specimen, entity, conn)
    diseases = [disease1,disease2]
    diseases_data = {}
    #查询数据
    for disease in diseases:
        query_sql = f"""
            SELECT *
            FROM `{molecule}-{feature}-{dataset}-{entity}-{disease}-{specimen}-{value}`
            WHERE feature LIKE '%{motif}%'
        """
        temp = pd.read_sql_query(query_sql, conn) #选择某个疾病类型下的某个基因的所有样本的值，应当是1*n的矩阵
        try:
            diseases_data[disease.upper()] = list(temp.iloc[0,1:].replace({'NA':np.NaN}).fillna(0).astype('float'))
        except IndexError:
            diseases_data[disease.upper()] = np.zeros(temp.shape[1],dtype='float')
    if len(diseases_data) == 0:
        raise NoDataError(motif,feature,dataset)

    #重整数据
    figsize = (10,4.5)
    data = pd.DataFrame(pd.DataFrame.from_dict(diseases_data,orient='index').T.unstack())
    data = data.reset_index().drop(labels='level_1',axis=1).rename(columns={'level_0':'Diseases',0:'Value'}).dropna()
    fig = Figure(figsize=figsize)
    sns.set(style="whitegrid")
    ax = fig.add_subplot(1,1,1)
    labels = list(beautify.beautify_series(data['Diseases']).unique())
    labels_combine = list(itertools.combinations(labels,2))
    #Boxplot
    plotfig = sns.boxplot(data=beautify.beautify_table(data,reset_col=False), x='Diseases',y='Value',notch=False,ax=ax)
    plotfig = sns.stripplot(x='Diseases', y='Value', data=beautify.beautify_table(data,reset_col=False),ax=ax,alpha=1,size=2.5)
    ax.set_xlabel('Disease Conditions')
    ax.set_ylabel(f'{beautify.beautify(value)}')
    ax.set_xticklabels(labels,rotation=45)
    ax.set_title(motif,fontdict={'fontsize':8})
    # #Fill color
    # cmap = cm.ScalarMappable(cmap=mpl.cm.cool)
    # test_mean = [np.mean(x) for x in data]
    # for patch, color in zip(plotfig['boxes'], cmap.to_rgba(test_mean)):
    #     patch.set_facecolor(color)

    #统计注释
    if len(labels)>1:
        annot = Annotator(plotfig, labels_combine, data=beautify.beautify_table(data,reset_col=False), x='Diseases',y='Value', order=labels)
        annot.configure(test='Mann-Whitney', loc='inside', verbose=2, text_format='star', line_height=0.02, line_offset=0.05, text_offset=0.04)
        annot.apply_test()
        ax, _ = annot.annotate()
    fig.tight_layout()
    return fig