from django.http import (
    HttpResponse,
    HttpResponseServerError,
)

from django.conf import settings

from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    renderer_classes,
)
from rest_framework.renderers import (
    StaticHTMLRenderer,
    JSONRenderer,
)
from rest_framework import status

from matplotlib.figure import Figure
from numpy.random import rand
from io import (
    BytesIO,
    StringIO,
)
from urllib.parse import quote_from_bytes

import pymysql
from django.conf import settings

from plot.plots import (
    table_bar,
    stack_box,
    non_stack_box,
    heat_map,
    comparison,
    select_entity,
    comparison_cls3,
    stack_bar_microbe,
    stack_bar_motif,
    biomarker_search,
    select_specimen,
    scatter,
    select_disease,
    select_disease_cls3,
    comparison_two,
    comparison_two_cls3,
)

from plot.statistics import (
    plot_statistics,
    auto_stat,
)

from plot.plots.no_data_error import (
    NoDataError,
    FeatureError,
    NoBiomarkerError,
    NoPairError,
    NoEntityError,
)

from .email_view import *


def create_conn():
    return pymysql.connect(
        host=settings.EXOMICS_DB_HOST,
        port=settings.EXOMICS_DB_PORT,
        user=settings.EXOMICS_DB_USER,
        password=settings.EXOMICS_DB_PASSWORD,
        database=settings.EXOMICS_DB_NAME,
    )


def format_to_mime_subtype(format):
    if format == 'svg':
        return 'svg+xml'
    return format


def fig_to_data_url(fig, format='svg'):
    """Convert Figure instance to data url."""
    b = BytesIO()
    with b:
        fig.savefig(b, format=format)
        fig.clear()
        b.seek(0)
        b_quoted = quote_from_bytes(b.getvalue())

    data_url = 'data:image/'\
        + f'{format_to_mime_subtype(format)},'\
        + f'{b_quoted}'

    return data_url


def fig_to_html(fig):
    """Convert Figure instance to its html presentation."""
    data_url = fig_to_data_url(fig)

    html = '<html><body>'\
        + f'<img src="{data_url}" /></body></html>'
    return html


def plotly_to_html(fig, format):
    """Save a plotly figure to html bytes."""
    b = StringIO()
    if format == 'html':
        fig.write_html(
            file=b,
            include_plotlyjs='cdn',
            full_html=True,
        )
    else:
        fig.write_html(
            file=b,
            include_plotlyjs=False,
            full_html=False,
        )
    b.seek(0)
    return b


def response_from_fig_and_type(fig, type):
    """Helper function."""
    content_type = 'text/html'
    if type == 'html':
        content_type = 'text/html'
    elif type == 'text':
        content_type = 'text/plain'
    else:
        # Passed stream is closed by django automatically.
        return HttpResponseServerError(f'Invalid format type: {type}')
    html = plotly_to_html(fig, type)
    # Passed stream is closed by django automatically.
    return HttpResponse(html, content_type=content_type)


def demo_plot():
    """Serve a static svg plot."""
    fig = Figure()
    ax = fig.subplots()

    fruits = ['apple', 'blueberry', 'cherry', 'orange']
    counts = rand(4) * 100
    counts = counts.astype('int')
    bar_labels = ['red', 'blue', '_red', 'orange']
    bar_colors = ['tab:red', 'tab:blue', 'tab:red', 'tab:orange']

    ax.bar(fruits, counts, label=bar_labels, color=bar_colors)

    ax.set_ylabel('fruit supply')
    ax.set_title('Fruit supply by kind and color (random values)')
    ax.legend(title='Fruit color')

    b = BytesIO()
    with b:
        fig.savefig(b, format='svg')
        fig.clear()
        b.seek(0)
        b_quoted = quote_from_bytes(b.getvalue())

    html = '<html><body>'\
        + f'<img src="data:image/svg+xml,{b_quoted}" /></body></html>'
    return html


@api_view(['GET'])
@renderer_classes([StaticHTMLRenderer])
def demo_view(request):
    html = demo_plot()
    return Response(html)


@api_view(['GET'])
@renderer_classes([StaticHTMLRenderer])
def bar_view(request):
    """Bar plot"""
    gene = request.query_params.get('gene')
    feature = request.query_params.get('feature')
    dataset = request.query_params.get('dataset')
    specimen = request.query_params.get('specimen')
    disease = request.query_params.get('disease')
    entity = request.query_params.get('entity')
    conn = create_conn()
    with conn:
        fig, table_json = table_bar.table_bar(
            gene,
            feature,
            dataset,
            disease,
            specimen,
            entity,
            conn
        )
    return response_from_fig_and_type(fig, 'html')


@api_view(['GET'])
@renderer_classes([StaticHTMLRenderer])
def box_stacked_view(request):
    """Bar plot"""
    gene = request.query_params.get('gene')
    feature = request.query_params.get('feature')
    dataset = request.query_params.get('dataset')
    specimen = request.query_params.get('specimen')
    entity = request.query_params.get('entity')
    conn = create_conn()
    with conn:
        fig = stack_box.stack_box(
            gene, feature, dataset, specimen, entity, conn
        )
    return response_from_fig_and_type(fig, 'html')


@api_view(['GET'])
@renderer_classes([StaticHTMLRenderer])
def box_unstacked_view(request):
    """Bar plot"""
    gene = request.query_params.get('gene')
    feature = request.query_params.get('feature')
    dataset = request.query_params.get('dataset')
    specimen = request.query_params.get('specimen')
    entity = request.query_params.get('entity')
    conn = create_conn()
    with conn:
        fig = non_stack_box.non_stack_box(
            gene, feature, dataset, specimen, entity, conn
        )
    return response_from_fig_and_type(fig, 'html')


@api_view(['GET'])
@renderer_classes([StaticHTMLRenderer])
def heat_map_view(request):
    """Heat map"""
    gene = request.query_params.get('gene')
    feature = request.query_params.get('feature')
    dataset = request.query_params.get('dataset')
    specimen = request.query_params.get('specimen')
    entity = request.query_params.get('entity')
    conn = create_conn()
    with conn:
        fig = heat_map.heat_map(
            gene, feature, dataset, specimen, entity, conn
        )
    return response_from_fig_and_type(fig, 'html')


@api_view(['GET'])
@renderer_classes([StaticHTMLRenderer])
def comparison_view(request):
    """Heat map"""
    gene = request.query_params.get('gene')
    feature = request.query_params.get('feature')
    dataset = request.query_params.get('dataset')
    specimen = request.query_params.get('specimen')
    entity = request.query_params.get('entity')
    anentity = request.query_params.get('anentity')
    conn = create_conn()
    with conn:
        fig = comparison.comparison(
            gene, feature, dataset, specimen, entity, conn, anentity
        )
    html = fig_to_html(fig)
    return Response(html)


@api_view(['GET'])
def bar_view1(request):
    """Bar plot"""
    gene = request.query_params.get('gene')
    feature = request.query_params.get('feature')
    dataset = request.query_params.get('dataset')
    specimen = request.query_params.get('specimen')
    disease = request.query_params.get('disease')
    entity = request.query_params.get('entity')
    conn = create_conn()
    try:
        with conn:
            fig, table_json = table_bar.table_bar(
                gene,
                feature,
                dataset,
                disease,
                specimen,
                entity,
                conn
            )
        stream = plotly_to_html(fig, 'text')
        with stream:
            inner_html = stream.getvalue()
        data = {
            "image": inner_html,
            "table": table_json
        }
        return Response(data)
    except (
        NoDataError,
        FeatureError,
        NoEntityError,
        NoBiomarkerError,
        NoPairError,
    ) as ce:
        return Response(
            data={ "detail": str(ce) },
            status=status.HTTP_400_BAD_REQUEST,
            content_type='application/json',
        )
    except Exception as e:
        return Response(
            data={ "detail": str(e) },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content_type='application/json'
        )


@api_view(['GET'])
def box_stacked_view1(request):
    """Bar plot"""
    gene = request.query_params.get('gene')
    feature = request.query_params.get('feature')
    dataset = request.query_params.get('dataset')
    specimen = request.query_params.get('specimen')
    entity = request.query_params.get('entity')
    conn = create_conn()
    try:
        with conn:
            fig = stack_box.stack_box(
                gene, feature, dataset, specimen, entity, conn
            )
        return response_from_fig_and_type(fig, 'text')
    except (
        NoDataError,
        FeatureError,
        NoEntityError,
        NoBiomarkerError,
        NoPairError,
    ) as ce:
        return Response(
            data={ "detail": str(ce) },
            status=status.HTTP_400_BAD_REQUEST,
            content_type='application/json',
        )
    except Exception as e:
        return Response(
            data={ "detail": str(e) },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content_type='application/json'
        )


@api_view(['GET'])
def box_unstacked_view1(request):
    """Bar plot"""
    gene = request.query_params.get('gene')
    feature = request.query_params.get('feature')
    dataset = request.query_params.get('dataset')
    specimen = request.query_params.get('specimen')
    entity = request.query_params.get('entity')
    conn = create_conn()
    try:
        with conn:
            fig = non_stack_box.non_stack_box(
                gene, feature, dataset, specimen, entity, conn
            )
        return response_from_fig_and_type(fig, 'text')
    except (
        NoDataError,
        FeatureError,
        NoEntityError,
        NoBiomarkerError,
        NoPairError,
    ) as ce:
        return Response(
            data={ "detail": str(ce) },
            status=status.HTTP_400_BAD_REQUEST,
            content_type='application/json',
        )
    except Exception as e:
        return Response(
            data={ "detail": str(e) },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content_type='application/json'
        )


@api_view(['GET'])
def heat_map_view1(request):
    """Heat map"""
    gene = request.query_params.get('gene')
    feature = request.query_params.get('feature')
    dataset = request.query_params.get('dataset')
    specimen = request.query_params.get('specimen')
    entity = request.query_params.get('entity')
    conn = create_conn()
    try:
        with conn:
            fig = heat_map.heat_map(
                gene, feature, dataset, specimen, entity, conn
            )
        return response_from_fig_and_type(fig, 'text')
    except (
        NoDataError,
        FeatureError,
        NoEntityError,
        NoBiomarkerError,
        NoPairError,
    ) as ce:
        return Response(
            data={ "detail": str(ce) },
            status=status.HTTP_400_BAD_REQUEST,
            content_type='application/json',
        )
    except Exception as e:
        return Response(
            data={ "detail": str(e) },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content_type='application/json'
        )


@api_view(['GET'])
def comparison_view1(request):
    """Heat map"""
    gene = request.query_params.get('gene')
    feature = request.query_params.get('feature')
    dataset = request.query_params.get('dataset')
    specimen = request.query_params.get('specimen')
    entity = request.query_params.get('entity')
    anentity = request.query_params.get('anentity') or None
    conn = create_conn()
    try:
        with conn:
            fig = comparison.comparison(
                gene, feature, dataset, specimen, entity, conn, anentity
            )
        data_url = fig_to_data_url(fig)
        return Response(data_url)
    except (
        NoDataError,
        FeatureError,
        NoEntityError,
        NoBiomarkerError,
        NoPairError,
    ) as ce:
        return Response(
            data={ "detail": str(ce) },
            status=status.HTTP_400_BAD_REQUEST,
            content_type='application/json',
        )
    except Exception as e:
        return Response(
            data={ "detail": str(e) },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content_type='application/json'
        )


@api_view(['GET'])
def find_anentities_view(request):
    """Anentities list"""
    gene = request.query_params.get('gene')
    feature = request.query_params.get('feature')
    dataset = request.query_params.get('dataset')
    specimen = request.query_params.get('specimen')
    entity = request.query_params.get('entity')
    conn = create_conn()
    try:
        with conn:
            anentities = select_entity.select_entity(
                gene, dataset, feature, specimen, entity, conn
            )
        return Response(anentities)
    except (
        NoDataError,
        FeatureError,
        NoEntityError,
        NoBiomarkerError,
        NoPairError,
    ) as ce:
        return Response(
            data={ "detail": str(ce) },
            status=status.HTTP_400_BAD_REQUEST,
            content_type='application/json',
        )
    except Exception as e:
        return Response(
            data={ "detail": str(e) },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content_type='application/json'
        )


@api_view(['GET'])
def statistics_view(request):
    """Statistics page plots."""
    former = request.query_params.get('former')
    latter = request.query_params.get('latter')
    type = request.query_params.get('type') or 'html'
    main = bool(int(request.query_params.get('main') or 0))
    conn = create_conn()
    try:
        with conn:
            fig = plot_statistics.statistics_plot(
                former,
                latter,
                conn,
                main
            )
        return response_from_fig_and_type(fig, type)
    except (
        NoDataError,
        FeatureError,
        NoEntityError,
        NoBiomarkerError,
        NoPairError,
    ) as ce:
        return Response(
            data={ "detail": str(ce) },
            status=status.HTTP_400_BAD_REQUEST,
            content_type='application/json',
        )
    except Exception as e:
        return Response(
            data={ "detail": str(e) },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content_type='application/json'
        )


@api_view(['GET'])
@renderer_classes([StaticHTMLRenderer])
def endmotif_comparison_view(request):
    """Endmotif comparison motifs."""
    motif = request.query_params.get('motif')
    feature = 'endmotif'
    dataset = request.query_params.get('dataset')
    specimen = request.query_params.get('specimen')
    conn = create_conn()
    with conn:
        fig = comparison_cls3.comparison_cls3(
            motif,
            feature,
            dataset,
            specimen,
            conn,
        )
    html = fig_to_html(fig)
    return Response(html)


@api_view(['GET'])
def endmotif_comparison_view1(request):
    """Endmotif comparison motifs."""
    motif = request.query_params.get('motif')
    feature = 'endmotif'
    dataset = request.query_params.get('dataset')
    specimen = request.query_params.get('specimen')
    conn = create_conn()
    try:
        with conn:
            fig = comparison_cls3.comparison_cls3(
                motif,
                feature,
                dataset,
                specimen,
                conn,
            )
        data_url = fig_to_data_url(fig)
        return Response(data_url)
    except (
        NoDataError,
        FeatureError,
        NoEntityError,
        NoBiomarkerError,
        NoPairError,
    ) as ce:
        return Response(
            data={ "detail": str(ce) },
            status=status.HTTP_400_BAD_REQUEST,
            content_type='application/json',
        )
    except Exception as e:
        return Response(
            data={ "detail": str(e) },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content_type='application/json'
        )


@api_view(['GET'])
@renderer_classes([StaticHTMLRenderer])
def microbe_comparison_view(request):
    """Microbe comparison motifs."""
    motif = request.query_params.get('motif')
    feature = 'microbe'
    dataset = request.query_params.get('dataset')
    specimen = request.query_params.get('specimen')
    conn = create_conn()
    with conn:
        fig = comparison_cls3.comparison_cls3(
            motif,
            feature,
            dataset,
            specimen,
            conn,
        )
    html = fig_to_html(fig)
    return Response(html)


@api_view(['GET'])
def microbe_comparison_view1(request):
    """Microbe comparison motifs."""
    motif = request.query_params.get('motif')
    feature = 'microbe'
    dataset = request.query_params.get('dataset')
    specimen = request.query_params.get('specimen')
    conn = create_conn()
    try:
        with conn:
            fig = comparison_cls3.comparison_cls3(
                motif,
                feature,
                dataset,
                specimen,
                conn,
            )
        data_url = fig_to_data_url(fig)
        return Response(data_url)
    except (
        NoDataError,
        FeatureError,
        NoEntityError,
        NoBiomarkerError,
        NoPairError,
    ) as ce:
        return Response(
            data={ "detail": str(ce) },
            status=status.HTTP_400_BAD_REQUEST,
            content_type='application/json',
        )
    except Exception as e:
        return Response(
            data={ "detail": str(e) },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content_type='application/json'
        )


@api_view(['GET'])
def browse_microbe_stack_bar_view(request):
    """Browse page, microbe profile plot"""
    dataset = request.query_params.get('dataset')
    specimen = request.query_params.get('specimen')
    entity = request.query_params.get('entity')
    type = request.query_params.get('type') or 'text'
    conn = create_conn()
    try:
        with conn:
            fig = stack_bar_microbe.stack_bar_microbe(
                dataset,
                specimen,
                entity,
                conn
            )
        return response_from_fig_and_type(fig, type)
    except (
        NoDataError,
        FeatureError,
        NoEntityError,
        NoBiomarkerError,
        NoPairError,
    ) as ce:
        return Response(
            data={ "detail": str(ce) },
            status=status.HTTP_400_BAD_REQUEST,
            content_type='application/json',
        )
    except Exception as e:
        return Response(
            data={ "detail": str(e) },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content_type='application/json'
        )


@api_view(['GET'])
def browse_endmotif_stack_bar_view(request):
    """Browse page, endmotif profile plot"""
    dataset = request.query_params.get('dataset')
    specimen = request.query_params.get('specimen')
    nmer = int(request.query_params.get('nmer'))
    conn = create_conn()
    try:
        with conn:
            fig = stack_bar_motif.stack_bar_motif(
                dataset,
                specimen,
                nmer,
                conn
            )
        return response_from_fig_and_type(fig, 'text')
    except (
        NoDataError,
        FeatureError,
        NoEntityError,
        NoBiomarkerError,
        NoPairError,
    ) as ce:
        return Response(
            data={ "detail": str(ce) },
            status=status.HTTP_400_BAD_REQUEST,
            content_type='application/json',
        )
    except Exception as e:
        return Response(
            data={ "detail": str(e) },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content_type='application/json'
        )


@api_view(['GET'])
@renderer_classes([JSONRenderer])
def gene_biomarker_view(request):
    """Related biomarkers on gene page"""
    gene = request.query_params.get('gene')
    conn = create_conn()
    try:
        with conn:
            data = biomarker_search.biomarker_search(
                gene,
                conn
            )
        return Response(
            data,
            content_type='application/json',
            status=status.HTTP_200_OK,
        )
    except (
        NoDataError,
        FeatureError,
        NoEntityError,
        NoBiomarkerError,
        NoPairError,
    ) as ce:
        return Response(
            data={ "detail": str(ce) },
            status=status.HTTP_400_BAD_REQUEST,
            content_type='application/json',
        )
    except Exception as e:
        return Response(
            data={ "detail": str(e) },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content_type='application/json'
        )


@api_view(['GET'])
@renderer_classes([JSONRenderer])
def corr_specimen_view(request):
    """Return available specimen choices based on given 2 features."""
    feature1 = request.query_params.get('feature1')
    feature2 = request.query_params.get('feature2')
    conn = create_conn()
    try:
        with conn:
            data = select_specimen.select_specimen(
                feature1,
                feature2,
                conn
            )
        return Response(
            data,
            content_type='application/json',
            status=status.HTTP_200_OK,
        )
    except (
        NoDataError,
        FeatureError,
        NoEntityError,
        NoBiomarkerError,
        NoPairError,
    ) as ce:
        return Response(
            data={ "detail": str(ce) },
            status=status.HTTP_400_BAD_REQUEST,
            content_type='application/json',
        )
    except Exception as e:
        return Response(
            data={ "detail": str(e) },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content_type='application/json'
        )


@api_view(['GET'])
def corr_scatter_view(request):
    """Draw correlation scatter plot"""
    gene = request.query_params.get('gene')
    feature1 = request.query_params.get('feature1')
    entity1 = request.query_params.get('entity1')
    feature2 = request.query_params.get('feature2')
    entity2 = request.query_params.get('entity2')
    specimen = request.query_params.get('specimen')
    type = request.query_params.get('type') or 'text'
    conn = create_conn()
    try:
        with conn:
            fig = scatter.scatter(
                gene,
                feature1,
                feature2,
                specimen,
                entity1,
                entity2,
                conn
            )
        return response_from_fig_and_type(fig, type)
    except (
        NoDataError,
        FeatureError,
        NoEntityError,
        NoBiomarkerError,
        NoPairError,
    ) as ce:
        return Response(
            data={ "detail": str(ce) },
            status=status.HTTP_400_BAD_REQUEST,
            content_type='application/json',
        )
    except Exception as e:
        return Response(
            data={ "detail": str(e) },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content_type='application/json'
        )


@api_view(['GET'])
def update_stats_view(request):
    """Update statistics info in database."""
    token = request.headers.get('Authorization')
    if token != settings.ADMIN_AUTH_TOKEN:
        return Response(
            data={ 'detail': 'Invalid auth token' },
            status=status.HTTP_401_UNAUTHORIZED,
            content_type='application/json',
        )
    conn = create_conn()
    try:
        auto_stat.auto_stat(conn)
        return Response(status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            data={ "detail": str(e) },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content_type='application/json'
        )


@api_view(['GET'])
def select_diseases_view(request):
    """
    Select available diseases according to
    feature, dataset, specimen and entity
    """
    dataset = request.query_params.get('dataset')
    feature = request.query_params.get('feature')
    specimen = request.query_params.get('specimen')
    entity = request.query_params.get('entity')
    conn = create_conn()
    try:
        with conn:
            diseases = select_disease.select_disease(
                dataset=dataset,
                feature=feature,
                specimen=specimen,
                entity=entity,
                conn=conn
            )
            return Response(
                diseases,
                status=status.HTTP_200_OK,
            )
    except Exception as e:
        return Response(
            { 'detail': str(e) },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def select_diseases_microbe_view(request):
    """
    Select available diseases for microbes
    """
    motif = request.query_params.get('motif')
    dataset = request.query_params.get('dataset')
    specimen = request.query_params.get('specimen')
    conn = create_conn()
    try:
        with conn:
            diseases = select_disease_cls3.select_disease_cls3(
                motif=motif,
                dataset=dataset,
                specimen=specimen,
                conn=conn
            )
            return Response(
                diseases,
                status=status.HTTP_200_OK,
            )
    except Exception as e:
        return Response(
            { 'detail': str(e) },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@renderer_classes([JSONRenderer])
def new_comparison_two_view(request):
    """Compare two diseases, class 1 data"""
    gene = request.query_params.get('gene')
    feature = request.query_params.get('feature')
    dataset = request.query_params.get('dataset')
    specimen = request.query_params.get('specimen')
    entity = request.query_params.get('entity')
    disease1 = request.query_params.get('disease1')
    disease2 = request.query_params.get('disease2')
    anentity = request.query_params.get('anentity') or None
    try:
        html = int(request.query_params.get('html')) or 0
        html = bool(html)
    except:
        html = False

    try:
        conn = create_conn()
        with conn:
            fig = comparison_two.comparison_two(
                gene=gene,
                feature=feature,
                dataset=dataset,
                specimen=specimen,
                entity=entity,
                disease1=disease1,
                disease2=disease2,
                conn=conn,
                anentity=anentity
            )
        if html:
            fig_html = fig_to_html(fig)
            return HttpResponse(
                fig_html,
                status=status.HTTP_200_OK,
            )
        else:
            data_url = fig_to_data_url(fig)
            return Response(
                data_url,
                status=status.HTTP_200_OK,
            )
    except (
        NoDataError,
        FeatureError,
        NoEntityError,
        NoBiomarkerError,
        NoPairError,
    ) as ce:
        return Response(
            data={ "detail": str(ce) },
            status=status.HTTP_400_BAD_REQUEST,
            content_type='application/json',
        )
    except Exception as e:
        return Response(
            { 'detail': str(e) },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(['GET'])
@renderer_classes([JSONRenderer])
def new_comparison_two_cls3_view(request):
    """Compare two diseases, class 1 data"""
    motif = request.query_params.get('motif')
    feature = request.query_params.get('feature')
    dataset = request.query_params.get('dataset')
    specimen = request.query_params.get('specimen')
    entity = request.query_params.get('entity')
    disease1 = request.query_params.get('disease1')
    disease2 = request.query_params.get('disease2')
    try:
        html = int(request.query_params.get('html')) or 0
        html = bool(html)
    except:
        html = False

    try:
        conn = create_conn()
        with conn:
            fig = comparison_two_cls3.comparison_two_cls3(
                motif=motif,
                feature=feature,
                dataset=dataset,
                specimen=specimen,
                entity=entity,
                disease1=disease1,
                disease2=disease2,
                conn=conn,
            )
        if html:
            fig_html = fig_to_html(fig)
            return HttpResponse(
                fig_html,
                status=status.HTTP_200_OK,
            )
        else:
            data_url = fig_to_data_url(fig)
            return Response(
                data_url,
                status=status.HTTP_200_OK,
            )
    except (
        NoDataError,
        FeatureError,
        NoEntityError,
        NoBiomarkerError,
        NoPairError,
    ) as ce:
        return Response(
            data={ "detail": str(ce) },
            status=status.HTTP_400_BAD_REQUEST,
            content_type='application/json',
        )
    except Exception as e:
        return Response(
            { 'detail': str(e) },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
