"""
URL configuration for shop project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from MainShop.views import *
from . import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('<str:target>-home/', home, name='target'),
    path('<str:target>-home/catalog/', catalog, name='catalog'),
    path('<str:target>-home/catalog/<str:category>/', category, name='category'),
    path('<str:target>-home/catalog/<str:category>/<str:subcategory>/', category, name='category'),
    path('test/', test_load),
    path('card/<int:pk>/color/<int:color_id>', product_card, name='card'),
    path('card/<int:pk>/color/<int:color_id>/size/<int:size_id>/', product_card, name='card_with_size'),
    path('', index, name='main'),
    path('cart/', load_cart, name='cart'),
    path('add-to-cart/<int:product_id>/color=<int:color_id>&size=<int:size_id>/', add_to_cart, name='add_to_cart'),
    path('cart/update/<int:stock_id>/', update_cart, name='update_cart'),
    path('cart/remove/<int:stock_id>/', delete_cart, name='delete_cart'),
    path('search/', search_products, name='search_products')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
