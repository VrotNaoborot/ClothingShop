from django.db import models
from django.contrib.auth.models import User

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from shop import settings

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        # Убедитесь, что для суперпользователя установлены необходимые поля
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):  # Добавляем PermissionsMixin
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # Можно оставить пустым, если не нужны другие поля

    def __str__(self):
        return self.email


class ClothingCategory(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="ID категории одежды")
    name = models.CharField(max_length=100, verbose_name="Название")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Категория одежды"
        verbose_name_plural = "Категории одежды"


class Color(models.Model):
    id = models.AutoField(primary_key=True, verbose_name="ID цвета")
    color = models.CharField(max_length=50, verbose_name="Цвет")

    def __str__(self):
        return self.color

    class Meta:
        verbose_name = "Цвет"
        verbose_name_plural = "Цвета"


class Sizes(models.Model):
    value = models.CharField(max_length=10)

    def __str__(self):
        return self.value

    class Meta:
        verbose_name = "Размер"
        verbose_name_plural = "Размеры"


class Brand(models.Model):
    name = models.CharField(max_length=100, verbose_name="Бренд")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Бренд"
        verbose_name_plural = "Бренд"


# Одежда
class Clothing(models.Model):
    TARGET_CHOICES = [
        ('M', 'Мужской'),
        ('F', 'Женский'),
        ('U', 'Унисекс'),
        ('C', 'Детский')
    ]

    id = models.AutoField(primary_key=True, verbose_name="ID одежды")
    model = models.CharField(max_length=100, verbose_name="Название модели")
    target = models.CharField(max_length=1, choices=TARGET_CHOICES, verbose_name="Пол")
    description = models.CharField(max_length=300, verbose_name="Описание")
    category = models.ForeignKey(ClothingCategory, on_delete=models.CASCADE, related_name="clothing")
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name="Бренд")
    avg_rating = models.DecimalField(max_digits=2, decimal_places=1, verbose_name="Средний рейтинг")

    def __str__(self):
        return f'{self.category.name}: {self.model} Rating: {self.avg_rating}'

    class Meta:
        verbose_name = "Модель одежды"
        verbose_name_plural = "Модель одежды"


class ColorsClothing(models.Model):
    clothing = models.ForeignKey(Clothing, on_delete=models.CASCADE, verbose_name="Одежда")
    color = models.ForeignKey(Color, on_delete=models.CASCADE, verbose_name="Цвет")
    image1 = models.ImageField(verbose_name="Изображение товара", blank=True, null=True)
    image2 = models.ImageField(verbose_name="Изображение товара", blank=True, null=True)
    image3 = models.ImageField(verbose_name="Изображение товара", blank=True, null=True)
    image4 = models.ImageField(verbose_name="Изображение товара", blank=True, null=True)
    image5 = models.ImageField(verbose_name="Изображение товара", blank=True, null=True)

    def __str__(self):
        return f"{self.clothing.model}: {self.color}"

    class Meta:
        verbose_name = "Цвета_Одежда"
        verbose_name_plural = "Цвета_Одежды"


class PriceHistory(models.Model):
    price = models.IntegerField(verbose_name="Цена")
    date_create = models.DateTimeField(auto_now_add=True, verbose_name="Дата и время добавления")
    color_clothing = models.ForeignKey(ColorsClothing, on_delete=models.CASCADE, verbose_name="Одежда")

    def __str__(self):
        return f"{self.price} - {self.date_create}"


class Stock(models.Model):
    colors_clothing = models.ForeignKey(ColorsClothing, on_delete=models.CASCADE, verbose_name="Цвета_одежды",
                                        default=-1)
    size = models.ForeignKey(Sizes, on_delete=models.CASCADE, verbose_name="Размер")
    count = models.IntegerField(verbose_name="Количество")

    def __str__(self):
        return f'{self.colors_clothing.clothing.model} - {self.colors_clothing.color.color} - {self.size.value}: {self.count} шт.'


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
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user_orders")
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
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cart_user")

    def __str__(self):
        return f"Корзина пользователя: {self.user}"

    class Meta:
        verbose_name = "Корзина"
        verbose_name_plural = "Корзины"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    colors_clothing = models.ForeignKey(ColorsClothing, on_delete=models.CASCADE, related_name='cart_items')
    count = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.clothes.name} (x{self.count})"
