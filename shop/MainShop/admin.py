from django.contrib import admin
from .models import Clothing, PriceHistory, Brand, ClothingCategory, Stock, Sizes, Color

# Регистрация моделей Brand и ClothingCategory
admin.site.register(Brand)
admin.site.register(ClothingCategory)


# Админка для модели Sizes с поддержкой поиска
@admin.register(Sizes)
class SizesAdmin(admin.ModelAdmin):
    search_fields = ['value']  # Поля, по которым будет осуществляться поиск для автозаполнения


# Админка для модели Color с поддержкой поиска
@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
    search_fields = ['color']  # Поля, по которым будет осуществляться поиск для автозаполнения


# Inline для истории цен
class PriceHistoryInline(admin.TabularInline):
    model = PriceHistory
    extra = 1  # Количество пустых форм для добавления новых цен


# Inline для размеров и цветов в Stock
class StockInline(admin.StackedInline):
    model = Stock
    extra = 1
    fields = ('color', 'size', 'count', 'image1', 'image2', 'image3', 'image4', 'image5')
    autocomplete_fields = ['size', 'color']  # Включаем автозаполнение для цвета и размера


# Админка для модели Clothing
@admin.register(Clothing)
class ClothingAdmin(admin.ModelAdmin):
    list_display = ('model', 'get_latest_price', 'category')
    search_fields = ('model',)
    inlines = [PriceHistoryInline, StockInline]  # Добавляем оба Inline

    def get_latest_price(self, obj):
        latest_price_history = PriceHistory.objects.filter(clothing=obj).order_by('-date_create').first()
        return latest_price_history.price if latest_price_history else "Нет цены"

    get_latest_price.short_description = 'Цена'
