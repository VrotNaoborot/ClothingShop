from django.contrib import admin
from .models import *


class StockInline(admin.TabularInline):
    model = Stock
    extra = 1


class PriceHistoryInline(admin.TabularInline):
    model = PriceHistory
    extra = 1  # Количество пустых форм для добавления


@admin.register(ColorsClothing)
class ColorsClothingAdmin(admin.ModelAdmin):
    inlines = [StockInline, PriceHistoryInline]
    list_display = ('clothing', 'color')  # Отображение модели одежды и цвета
    list_filter = ('color',)  # Фильтрация по цвету
    search_fields = ('color__color',)  # Поиск по цвету


# Регистрация остальных моделей
admin.site.register(ClothingCategory)
admin.site.register(Brand)
admin.site.register(Color)
admin.site.register(Clothing)
admin.site.register(Sizes)
admin.site.register(LargeCategory)
admin.site.register(Material)
admin.site.register(CountryManufacture)
admin.site.register(Season)
