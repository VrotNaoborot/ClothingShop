from django.db import models
from django.contrib.auth.models import User


class ClothingCategory(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="ID категории одежды")
    name = models.CharField(max_length=100, verbose_name="Название")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Категория одежды"
        verbose_name_plural = "Категории одежды"


class Clothing(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="ID одежды")
    name = models.CharField(max_length=100, verbose_name="Название")
    sex = models.CharField(max_length=100, verbose_name="Пол")
    color = models.CharField(max_length=40, verbose_name="Цвет")
    price = models.DecimalField(max_digits=15, decimal_places=2, verbose_name="Цена")
    size = models.CharField(max_length=10, verbose_name="Размер")
    description = models.CharField(max_length=300, verbose_name="Описание")
    count = models.IntegerField(verbose_name="Количество в наличии")
    category = models.ForeignKey(ClothingCategory, on_delete=models.CASCADE, related_name="clothing")

    def __str__(self):
        return f'{self.name}: {self.price}'

    class Meta:
        verbose_name = "Одежда"
        verbose_name_plural = "Одежда"


class Orders(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('unpaid', 'Не оплачено'),
        ('paid', 'Оплачено')
    ]
    ORDER_STATUS_CHOICES = [
        ('new', 'Новый'),
        ('processing', 'В обработке'),
        ('shipped', 'Отправлен'),
        ('delivered', 'Доставлен'),
        ('canceled', 'Отменен'),
    ]
    id = models.AutoField(primary_key=True, verbose_name="ID заказа")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_orders")
    created_date = models.DateTimeField(auto_now_add=True, verbose_name="Дата и время создания")
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, verbose_name="Статус оплаты")
    order_status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, verbose_name="Статус заказа")

    def __str__(self):
        return f"Order: {self.id} User: {self.user}"

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"


class OrdersDetail(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="ID детали заказа")
    order = models.ForeignKey(Orders, on_delete=models.CASCADE, related_name="order")
    clothes = models.ForeignKey(Clothing, on_delete=models.CASCADE, related_name="order_detail_clothes")
    count = models.IntegerField(verbose_name="Количество")
    price_when_ordering = models.DecimalField(max_digits=15, decimal_places=2, verbose_name="Цена при заказе")

    def __str__(self):
        return f"{self.order} {self.clothes} {self.count}"

    class Meta:
        verbose_name = "Детали заказа"
        verbose_name_plural = "Детали заказов"


class Cart(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="ID корзины")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart_user")
    clothes = models.ForeignKey(Clothing, on_delete=models.CASCADE, related_name="clothes_cart")
    count = models.IntegerField(verbose_name="Количество в корзине")

    def __str__(self):
        return f"{self.user} {self.clothes} {self.count}"

    class Meta:
        verbose_name = "Корзина"
        verbose_name_plural = "Корзины"
