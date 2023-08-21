
#! Endmotif专用

import pandas as pd
from matplotlib.figure import Figure
import numpy as np
from plots.select_molecole_entity_value import select_molecule_entity_value
import polars as pl
import plotly.express as px
# end motif stacked barplot
#展示各种疾病类型中所有end motif的占比，并可输入要查询的n-mer

def stack_bar_motif(dataset: str, specimen: str, nmer: int, conn) -> Figure:
    """
    dataset = 'gse81314' #此处值是范例，实际上需要根据网页决定 \\
    specimen = 'plasma' #此处值是范例，实际上需要根据网页决定 \\
    nmer = 3 #此处值是范例，实际上需要根据网页决定\\
    """
    entity = '4mer'
    disease = 'mean'
    feature = 'endmotif'
    molecule, value = select_molecule_entity_value(dataset, feature, specimen, entity, conn)

    assert nmer<=4 and nmer>=1, f"Invalid n-mer: {nmer}, which should be inside [1,4]."
    query_sql = f"""
        SELECT *
        FROM `{molecule}-{feature}-{dataset}-{entity}-{disease}-{specimen}-{value}`
    """

    df = pd.read_sql_query(query_sql, conn,dtype=str)
    df = df.replace({'None':'nan'}).fillna(0)
    df = pl.from_pandas(df)
    df = (
        df.with_columns(
            all().exclude('feature').cast(pl.Float64)
        )
        .with_columns(
            pl.col('feature').str.slice(0,length=nmer).alias('feature_nmer')
        ).fill_nan(0)
        .drop('feature').rename({'feature_nmer':'feature'}).select([
            pl.col('feature'),
            all().exclude('feature')
        ]).groupby('feature').agg([
            all().exclude('feature').sum()
        ]).with_columns(
            pl.all().exclude('feature')/pl.all().exclude('feature').sum()
        )
    ).melt(id_vars='feature',value_vars=df.columns[1:]).rename({'variable':'disease','value':'ratio'}).to_pandas()#get the data

    fig = px.bar(df,x='disease',y='ratio',color='feature', labels={'disease':'Diseases','ratio':f'Motif({nmer}-mer) Ratio'},
                color_discrete_sequence=px.colors.qualitative.Antique)
    return fig