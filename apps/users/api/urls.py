from django.urls import path
from apps.users.api.views.auth import register_view, CustomTokenObtainPairView, home_view
from apps.users.api.views.user import user_list_create_view, user_detail_api_view
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('', home_view, name='home'),
    path('register/', register_view, name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/', user_list_create_view, name='user-list-create'),
    path('users/<int:pk>/', user_detail_api_view, name='user-detail-api'),
]
