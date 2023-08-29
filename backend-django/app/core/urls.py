from django.urls import path
from core import views


urlpatterns = [
    path(
        'html/demo',
        views.demo_view,
        name='html/demo_plot'
    ),
    path(
        'html/box_unstacked',
        views.box_unstacked_view,
        name='html/box_unstacked',
    ),
    path(
        'html/box_stacked',
        views.box_stacked_view,
        name='html/box_stacked',
    ),
    path(
        'html/bar',
        views.bar_view,
        name='html/bar',
    ),
    path(
        'html/heat_map',
        views.heat_map_view,
        name='html/heat_map',
    ),
    path(
        'html/comparison',
        views.comparison_view,
        name='html/comparison',
    ),
    path(
        'data_url/box_unstacked',
        views.box_unstacked_view1,
        name='data_url/box_unstacked',
    ),
    path(
        'data_url/box_stacked',
        views.box_stacked_view1,
        name='data_url/box_stacked',
    ),
    path(
        'data_url/bar',
        views.bar_view1,
        name='data_url/bar',
    ),
    path(
        'data_url/heat_map',
        views.heat_map_view1,
        name='data_url/heap_map',
    ),
    path(
        'data_url/comparison',
        views.comparison_view1,
        name='data_url/comparison',
    ),
    path(
        'misc/find_anentities',
        views.find_anentities_view,
        name='misc/find_anentities'
    ),
    path(
        'statistics',
        views.statistics_view,
        name='statistics'
    ),
    path(
        'html/endmotif_comparison',
        views.endmotif_comparison_view,
        name='html/endmotif_comparison',
    ),
    path(
        'data_url/endmotif_comparison',
        views.endmotif_comparison_view1,
        name='data_url/endmotif_comparison',
    ),
    path(
        'html/microbe_comparison',
        views.microbe_comparison_view,
        name='html/microbe_comparison',
    ),
    path(
        'data_url/microbe_comparison',
        views.microbe_comparison_view1,
        name='data_url/microbe_comparison',
    ),
    path(
        'data_url/browse_microbe_stack_bar',
        views.browse_microbe_stack_bar_view,
        name='data_url/browse_microbe_stack_bar',
    ),
    path(
        'data_url/browse_endmotif_stack_bar',
        views.browse_endmotif_stack_bar_view,
        name='data_url/browse_endmotif_stack_bar',
    ),
    path(
        'misc/gene_biomarker',
        views.gene_biomarker_view,
        name='misc/gene_biomarker',
    ),
    path(
        'misc/corr_specimen',
        views.corr_specimen_view,
        name='misc/corr_specimen',
    ),
    path(
        'misc/corr_scatter',
        views.corr_scatter_view,
        name='misc/corr_scatter',
    ),
    ## disabled API endpoints for demo code
    # path(
    #     'misc/data_request',
    #     views.data_request_email_view,
    #     name='misc/data_request',
    # ),
    # path(
    #     'misc/update_stats',
    #     views.update_stats_view,
    #     name='misc/update_stats',
    # ),
    # path(
    #     'misc/get_request_list',
    #     views.get_request_list_view,
    #     name='misc/get_request_list',
    # ),
    path(
        'misc/select_diseases',
        views.select_diseases_view,
        name='misc/select_diseases',
    ),
    path(
        'misc/select_diseases_microbe',
        views.select_diseases_microbe_view,
        name='misc/select_diseases_microbe',
    ),
    path(
        'misc/new_comparison_two',
        views.new_comparison_two_view,
        name='misc/new_comparison_two',
    ),
    path(
        'misc/new_comparison_two_cls3',
        views.new_comparison_two_cls3_view,
        name='misc/new_comparison_two_cls3',
    )
]
