from django.contrib import admin
from .models import Clothing, PriceHistory


class PriceHistoryInline(admin.TabularInline):
    model = PriceHistory
    extra = 1  # Количество пустых форм для добавления новых цен


@admin.register(Clothing)
class ClothingAdmin(admin.ModelAdmin):
    list_display = ('model', 'get_latest_price', 'category')
    search_fields = ('model',)
    inlines = [PriceHistoryInline]  # Добавляем inline для PriceHistory

    def get_latest_price(self, obj):
        """Получает последнюю цену для текущего объекта Clothing."""
        latest_price_history = PriceHistory.objects.filter(clothing=obj).order_by('-date_create').first()
        return latest_price_history.price if latest_price_history else "Нет цены"

    get_latest_price.short_description = 'Цена'  # Подпись для колонки в админке
