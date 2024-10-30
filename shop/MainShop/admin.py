from django.contrib import admin
from .models import ColorsClothing, Stock, Sizes, Color, Clothing, ClothingCategory, Brand


class StockInline(admin.TabularInline):
    model = Stock
    extra = 1


@admin.register(ColorsClothing)
class ColorsClothingAdmin(admin.ModelAdmin):
    # Одежда
    inlines = [StockInline]


@admin.register(Sizes)
class SizesAdmin(admin.ModelAdmin):
    list_display = ('value',)


admin.site.register(ClothingCategory)
admin.site.register(Brand)
admin.site.register(Color)
admin.site.register(Clothing)
