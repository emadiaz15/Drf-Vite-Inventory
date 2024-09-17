from django.urls import path
from apps.comments.api.views.comment import comment_list_create_view, comment_detail_view

urlpatterns = [
    path('', comment_list_create_view, name='comments-list'),
    path('<int:pk>/', comment_detail_view, name='comments-detail'),
]
