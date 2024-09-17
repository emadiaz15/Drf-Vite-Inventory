from django.urls import path
from apps.users.api.views.auth import register_view, CustomTokenObtainPairView, home_view
from apps.users.api.views.user import user_list_create_view, user_detail_api_view
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('api/', home_view, name='home'),
    
    # Autenticación y JWT
    path('api/register/', register_view, name='register'),
    path('api/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Gestión de usuarios
    path('api/users/', user_list_create_view, name='user-list-create'),
    path('api/users/<int:pk>/', user_detail_api_view, name='user-detail'),
]
