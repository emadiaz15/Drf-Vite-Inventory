from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('admin/', admin.site.urls),  # Ruta al panel de administración de Django
    path('api/users/', include('apps.users.api.urls')),  # Incluye las rutas de la app `users`
    path('api/products/', include('apps.products.api.urls')),  # Incluye las rutas de la app `products`

    # Rutas para la documentación de la API con drf-spectacular
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),  # Esquema de la API
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),  # Documentación en Swagger UI
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),  # Documentación en ReDoc
]
