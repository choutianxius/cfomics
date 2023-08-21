import plotly.express as px
import pandas as pd
import pymysql
import random

from os.path import dirname, abspath
plot_base = dirname(dirname(abspath(__file__)))
import sys
sys.path.insert(1, plot_base)
import beautify.beautify as beautify

def statistics_plot(former: str, latter: str, conn, main=False):
    """
    former: ['dataset','disease','specimen','feature','marker'] 选择一个\\
    latter: ['sample','dataset','moletype'] 选择一个, former选择dataset时,latter只能选择sample; forme选择marker时,latter只能选择moletype\\
    main: False/True, 在主页展示时此参数为True,在statistics页面展示时设置为False(默认值)
    """
    sql_query = f"""
        SELECT *
        FROM statistics_{former}_by_{latter}
    """
    df = pd.read_sql_query(sql_query, conn)
    df[latter] = df[latter].astype(int)
    if former in ['marker','specimen']:
        df = beautify.beautify_table(df,reset_col=False).groupby(by=[former]).sum().reset_index()
    else:
        df = beautify.beautify_table(df,reset_col=False).groupby(by=[former,'pre']).sum().reset_index()
    df = df.sort_values(latter)
    # df[former] = df[former].str.upper()
    # if former not in ['specimen','marker']:
    #     df['pre'] = df['pre'].str.upper()
    colorset = px.colors.qualitative.Plotly
    # title = '' if main else f'Statistics of {former}s by {latter}s'
    title = ''
    conti_color = random.choice(('Agsunset','Emrld','Ice','RdPu','RdBu','thermal','speed','amp'))

    if not main: #statistics
        margin_dict = dict(
            l=5,
            r=5,
            b=30,
            t=30
        )
    else: #main
        margin_dict = dict(
            l=5,
            r=5,
            b=5,
            t=5
        )

    def tosunburst(former, latter, title):
        return px.sunburst(df,
            path=['pre',former],
            values=latter,color=latter,
            color_continuous_scale=conti_color,
            title=title
        ).update_traces(textinfo='label+value'
        ).update(layout_coloraxis_showscale=False
        ).update_layout(autosize=False,
        width=300,
        height=300,
        margin=margin_dict
        )

    def topie(former,latter,title):
        return px.pie(df, values=latter, names=former,
            title=title,
            color_discrete_sequence=colorset
        ).update_traces(textposition='inside', textinfo='label+value'
        ).update_layout(showlegend=False,
        autosize=False,
        width=300,
        height=300,
        margin=margin_dict)

    def totree(former,latter,title):
        return px.treemap(df, values=latter, path=[px.Constant('All features'),'pre',former],
            title=title,
            color=latter,
            color_continuous_scale=conti_color
        ).update_traces(textposition='top left', textinfo='label+value'
        ).update_layout(showlegend=False,
        autosize=False,
        width=600,
        height=400,
        margin=margin_dict)

    if former == 'feature':
        if main:
            return tosunburst(former, latter, title)
        else:
            return totree(former, latter, title)
    elif former not in ['specimen','marker']:
        return tosunburst(former, latter, title)
    else:
        return topie(former, latter, title)