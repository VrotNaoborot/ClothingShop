import random
import string
import json
from django.db import models
from django.db.models import Prefetch
from django.contrib.auth import authenticate, login as django_login
from django.shortcuts import render, redirect, get_object_or_404
from django.core.mail import send_mail
from django.http import HttpResponse
from django.http import JsonResponse
from .models import *
from django.urls import reverse
from django.db.models import Count
from django.db.models import Q
from shop import settings
from django.views.decorators.http import require_POST


def index(request):
    if request.method == 'GET':
        return render(request, "index.html")


def test_load(request):
    return render(request, 'test.html')


def product_card(request, pk, color_id, size_id=None):
    product = get_object_or_404(Clothing, id=pk)

    # Получаем объект цвета по color_id
    color = get_object_or_404(Color, id=color_id)

    clothing_color = get_object_or_404(ColorsClothing, clothing=product, color=color)

    stock_items = Stock.objects.filter(colors_clothing=clothing_color, count__gt=0)
    cart_items_user = CartItem.objects.filter(cart=request.user.cart)
    for cart_item in cart_items_user:
        if cart_item.stock.colors_clothing.clothing == product:
            product.is_cart_product = True
    if size_id:
        sizes = list(i.size for i in stock_items if i.count > 0)
        print(sizes, type(sizes[0]))
        stock_items = Stock.objects.filter(size_id=size_id)
    else:
        sizes = list(i.size for i in stock_items if i.count > 0)
        print(sizes, type(sizes[0]))

    # Проверяем, есть ли на складе
    if stock_items.exists():
        stock_first_item = stock_items[0]
        price_history = PriceHistory.objects.filter(color_clothing=clothing_color).order_by('-date_create')

        # Получаем доступные цвета с количеством на складе больше 0
        available_colors = (
            ColorsClothing.objects
            .filter(clothing=product)
            .annotate(stock_count=Count('stock', filter=Q(stock__count__gt=0)))
            .filter(stock_count__gt=0)
        )

        # Обработка цен и скидок
        if len(price_history) == 1:
            product.discount = False
            current_price = price_history[0].price
            product.current_price = f"{current_price:,}".replace(',', ' ')
        elif len(price_history) >= 2:
            new_price = price_history[0].price
            old_price = price_history[1].price
            if new_price < old_price:
                product.discount = True
                product.old_price = f"{old_price:,}".replace(',', ' ')
                product.new_price = f"{new_price:,}".replace(',', ' ')
                product.discount_value = int(((old_price - new_price) / old_price) * 100)
            else:
                product.discount = False
                product.current_price = f"{price_history[0].price:,}".replace(',', ' ')
        else:
            product.discount = False
            product.current_price = "Нет цен"

        # Формируем контекст для передачи в шаблон
        context = {
            'product': product,
            'colors': available_colors,  # Список доступных цветов
            'stock': stock_first_item,
            'current_color': color_id,
            'clothing_colors': clothing_color,
            'sizes': sizes
        }
        if size_id:
            context['current_size'] = size_id

        return render(request, 'cardViewProduct.html', context=context)


def add_to_cart(request, color_id, product_id, size_id):
    if request.method == 'POST' and request.user.is_authenticated:
        # Получаем товар и его цвет
        product = get_object_or_404(Clothing, id=product_id)
        color = get_object_or_404(Color, id=color_id)
        product_color = get_object_or_404(ColorsClothing, clothing=product, color=color)
        size = get_object_or_404(Sizes, id=size_id)
        stock_item = get_object_or_404(Stock, colors_clothing=product_color, size=size)

        if stock_item.count <= 0:
            return JsonResponse({'success': False, 'error': 'Товар отсутствует на складе.'})

        cart, created = Cart.objects.get_or_create(user=request.user)
        cart_item, created = CartItem.objects.get_or_create(cart=cart, stock=stock_item)

        if created:
            cart_item.quantity = 1  # Если это новый элемент, устанавливаем количество на 1
        else:
            cart_item.quantity += 1  # Если элемент уже существует, увеличиваем количество на 1

        cart_item.save()  # Сохраняем изменения

        return JsonResponse({'success': True, 'quantity': cart_item.quantity})

    # Если запрос не POST или пользователь не аутентифицирован
    return JsonResponse({'success': False, 'error': 'Invalid request or user not authenticated.'})


def load_cart(request):
    if request.method == 'GET' and request.user.is_authenticated:
        cart, created = Cart.objects.get_or_create(user=request.user)
        cart_items = CartItem.objects.filter(cart=cart)

        for item in cart_items:
            stock_product = item.stock
            color_product = stock_product.colors_clothing
            price_history = PriceHistory.objects.filter(color_clothing=color_product).order_by('-date_create')
            if price_history:
                item.current_price = price_history[0].price
        return render(request, 'cart.html', {
            'cart': cart,
            'cart_items': cart_items,
        })


@require_POST
def update_cart(request, stock_id):
    data = json.loads(request.body)
    quantity = data.get('quantity')
    if quantity is not None and quantity > 0:
        try:
            cart_item = CartItem.objects.get(cart=request.user.cart, stock_id=stock_id)
            cart_item.quantity = quantity
            cart_item.save()
            return JsonResponse({'success': True})
        except CartItem.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Cart item not found.'}, status=404)
    else:
        return JsonResponse({'success': False, 'error': 'Invalid quantity.'}, status=400)


@require_POST
def delete_cart(request, stock_id):
    try:
        cart_item = CartItem.objects.get(cart=request.user.cart, stock_id=stock_id)
        cart_item.delete()
        return JsonResponse({'success': True})
    except CartItem.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Cart item not found.'}, status=404)


def generate_verification_code(length=6):
    """Генерирует случайный код подтверждения."""
    return ''.join(random.choices(string.digits, k=length))


def mail_is_registrate(mail):
    return CustomUser.objects.filter(email=mail).exists()


def home(request, target):
    v = ""
    if target == 'men':
        v = "M"
    elif target == 'women':
        v = "F"
    elif target == 'child':
        v = "C"
    else:
        pass

    # popular_items
    #   query со всей одеждой подходящей по таргету
    target_clothing_items = Clothing.objects.filter(Q(target=v) | Q(target='U'))
    print(f"Cl: {target_clothing_items}")
    popular_clothing_items = []
    for clothing_item in target_clothing_items.order_by("-avg_rating"):
        if len(popular_clothing_items) == 20:
            break
        # все цвета этой одежды
        colors_clothing = ColorsClothing.objects.filter(clothing=clothing_item)
        print(f"Colors clotning: {colors_clothing}")
        for color_clothing in colors_clothing:

            stock_items = Stock.objects.filter(colors_clothing=color_clothing, count__gt=0)
            if stock_items:
                clothing_item.image1 = color_clothing.image1
                clothing_item.image2 = color_clothing.image2
                color_obj = color_clothing.color
                clothing_item.color_id = color_obj.id
                clothing_item.url = reverse('card', args=[clothing_item.id, clothing_item.color_id])

                price_history = PriceHistory.objects.filter(color_clothing=color_clothing).order_by('-date_create')
                if len(price_history) == 1:
                    clothing_item.discount = False
                    current_price = price_history[0].price
                    clothing_item.current_price = f"{current_price:,}".replace(',', ' ')
                elif len(price_history) >= 2:
                    new_price = price_history[0].price
                    old_price = price_history[1].price
                    if new_price < old_price:
                        clothing_item.discount = True
                        clothing_item.old_price = f"{old_price:,}".replace(',', ' ')
                        clothing_item.new_price = f"{new_price:,}".replace(',', ' ')
                        clothing_item.discount_value = int(((old_price - new_price) / old_price) * 100)
                    else:
                        clothing_item.discount = False
                        clothing_item.current_price = f"{price_history[0].price:,}".replace(',', ' ')
                else:
                    continue

                clothing_item.sizes = sorted(set(stock.size for stock in stock_items), key=lambda s: s.value)

                popular_clothing_items.append(clothing_item)
                break

    # discount_items

    discount_clothing = []
    for clothing_item_discount in target_clothing_items:
        if len(discount_clothing) == 20:
            break
        colors_clothing = ColorsClothing.objects.filter(clothing=clothing_item_discount)
        for color_clothing in colors_clothing:
            stock_items_discount = Stock.objects.filter(colors_clothing=color_clothing, count__gt=0)
            if stock_items_discount:
                price_history = PriceHistory.objects.filter(color_clothing=color_clothing).order_by('-date_create')
                if len(price_history) >= 2 and (price_history[0].price < price_history[1].price):
                    new_price = price_history[0].price
                    old_price = price_history[1].price
                    clothing_item_discount.image1 = color_clothing.image1
                    clothing_item_discount.image2 = color_clothing.image2
                    color_obj = color_clothing.color
                    clothing_item_discount.color_id = color_obj.id
                    clothing_item_discount.url = reverse('card', args=[clothing_item_discount.id,
                                                                       clothing_item_discount.color_id])
                    clothing_item_discount.discount = True
                    clothing_item_discount.newprice = new_price
                    clothing_item_discount.oldprice = old_price
                    clothing_item_discount.old_price = f"{old_price:,}".replace(',', ' ')
                    clothing_item_discount.new_price = f"{new_price:,}".replace(',', ' ')
                    clothing_item_discount.discount_value = int(((old_price - new_price) / old_price) * 100)
                    clothing_item_discount.sizes = sorted(set(stock.size for stock in stock_items_discount),
                                                          key=lambda s: s.value)
                    discount_clothing.append(clothing_item_discount)
                    break

    filter_discount_clothing = list(filter(lambda x: x.oldprice - x.newprice, discount_clothing))
    return render(request, "home.html",
                  {'popular_items': popular_clothing_items, 'discount_items': filter_discount_clothing})


def catalog(request, target):
    materials, colors, sizes, brands, countries = set(), set(), set(), set(), set()
    min_price = float('inf')
    max_price = float('-inf')

    v = "M"
    if target == 'men':
        v = "M"
    elif target == 'women':
        v = "F"
    elif target == 'child':
        v = "C"

    # popular_items
    #   query со всей одеждой подходящей по таргету
    target_clothing_items = Clothing.objects.filter(Q(target=v) | Q(target='U'))
    print(f"Cl: {target_clothing_items}")
    for clothing_item in target_clothing_items:
        materials.add(clothing_item.material)
        brands.add(clothing_item.brand)
        countries.add(clothing_item.country_manufacture)
        colors_clothing = ColorsClothing.objects.filter(clothing=clothing_item)
        print(f"Colors clotning: {colors_clothing}")

        for color_clothing in colors_clothing:
            stock_items = Stock.objects.filter(colors_clothing=color_clothing, count__gt=0)
            if stock_items:
                for stock in stock_items:
                    sizes.add(stock.size)
                clothing_item.image1 = color_clothing.image1
                clothing_item.image2 = color_clothing.image2
                color_obj = color_clothing.color
                colors.add(color_obj)
                clothing_item.color_id = color_obj.id
                clothing_item.url = reverse('card', args=[clothing_item.id, clothing_item.color_id])

                price_history = PriceHistory.objects.filter(color_clothing=color_clothing).order_by('-date_create')
                for price in price_history:
                    if price.price < min_price:
                        min_price = price.price
                    if price.price > max_price:
                        max_price = price.price
                if len(price_history) == 1:
                    clothing_item.discount = False
                    current_price = price_history[0].price
                    clothing_item.current_price = f"{current_price:,}".replace(',', ' ')
                elif len(price_history) >= 2:
                    new_price = price_history[0].price
                    old_price = price_history[1].price
                    if new_price < old_price:
                        clothing_item.discount = True
                        clothing_item.old_price = f"{old_price:,}".replace(',', ' ')
                        clothing_item.new_price = f"{new_price:,}".replace(',', ' ')
                        clothing_item.discount_value = int(((old_price - new_price) / old_price) * 100)
                    else:
                        clothing_item.discount = False
                        clothing_item.current_price = f"{price_history[0].price:,}".replace(',', ' ')
                else:
                    continue

                clothing_item.sizes = sorted(set(stock.size for stock in stock_items), key=lambda s: s.value)

    return render(request, 'catalog.html',
                  {'clothing_items': target_clothing_items, 'materials': materials, 'colors': colors, 'sizes': sizes, 'brands': brands, 'min_price': min_price, 'max_price': max_price, 'countries': countries})


def category(request, target, category, subcategory=None):
    v = "M"
    _category = "Одежда"
    if target == 'men':
        v = "M"
    elif target == 'women':
        v = "F"
    elif target == 'child':
        v = "C"

    if category == 'clothes':
        _category = 'Одежда'
    elif category == 'shoes':
        _category = 'Обувь'
    elif _category == 'accessories':
        _category = "Аксессуары"

    large_category = LargeCategory.objects.get(name=_category)
    target_clothing_items = Clothing.objects.filter(
        (Q(target=v) | Q(target='U')) & Q(large_category=large_category)
    )
    for clothing_item in target_clothing_items:
        colors_clothing = ColorsClothing.objects.filter(clothing=clothing_item)
        print(f"Colors clotning: {colors_clothing}")

        for color_clothing in colors_clothing:
            stock_items = Stock.objects.filter(colors_clothing=color_clothing, count__gt=0)
            if stock_items:
                clothing_item.image1 = color_clothing.image1
                clothing_item.image2 = color_clothing.image2
                color_obj = color_clothing.color
                clothing_item.color_id = color_obj.id
                clothing_item.url = reverse('card', args=[clothing_item.id, clothing_item.color_id])

                price_history = PriceHistory.objects.filter(color_clothing=color_clothing).order_by('-date_create')
                if len(price_history) == 1:
                    clothing_item.discount = False
                    current_price = price_history[0].price
                    clothing_item.current_price = f"{current_price:,}".replace(',', ' ')
                elif len(price_history) >= 2:
                    new_price = price_history[0].price
                    old_price = price_history[1].price
                    if new_price < old_price:
                        clothing_item.discount = True
                        clothing_item.old_price = f"{old_price:,}".replace(',', ' ')
                        clothing_item.new_price = f"{new_price:,}".replace(',', ' ')
                        clothing_item.discount_value = int(((old_price - new_price) / old_price) * 100)
                    else:
                        clothing_item.discount = False
                        clothing_item.current_price = f"{price_history[0].price:,}".replace(',', ' ')
                else:
                    continue

                clothing_item.sizes = sorted(set(stock.size for stock in stock_items), key=lambda s: s.value)

    return render(request, 'catalog.html', {'clothing_items': target_clothing_items})


def login(request):
    print(request.method)
    if request.method == 'POST':
        try:
            email = request.POST.get('email')
            password = request.POST.get('password')

            user = authenticate(request, email=email, password=password)
            if user is not None:
                django_login(request, user)
                return redirect('/')
            else:
                return render(request, 'login.html', {"error": "Invalid login or password"})
        except Exception as ex:
            return render(request, "login.html", {"error": ex})

    elif request.method == 'GET':
        return render(request, "login.html")


def register(request):
    if request.method == 'POST':
        try:
            data = request.POST
            email = data.get('email', None)
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            first_password = data.get('password')
            second_password = data.get('confirm_password')
            verification_code = data.get('verification_code', None)

            if email is None:
                return render(request, "registrate.html", {"error": "Необходимо отправить почту",
                                                           'first_name': first_name,
                                                           'last_name': last_name,
                                                           'email': email,
                                                           'password': first_password,
                                                           'confirm_password': second_password
                                                           })
            # Проверка, зарегистрирована ли почта
            if mail_is_registrate(email):
                return render(request, "registrate.html", {"error": "Данная почта уже зарегистрирована",
                                                           'first_name': first_name,
                                                           'last_name': last_name,
                                                           'email': email,
                                                           'password': first_password,
                                                           'confirm_password': second_password
                                                           })

            if verification_code:
                # Проверка кода подтверждения
                stored_code = request.session.get('verification_code')
                if stored_code == verification_code:
                    # Код подтвержден, продолжаем регистрацию
                    first_name = data.get('first_name')
                    last_name = data.get('last_name')
                    password = data.get('password')

                    if not all([first_name, last_name, email, password]):
                        return render(request, "registrate.html", {"error": "Введите все данные"})

                    user = CustomUser.objects.create_user(
                        first_name=first_name,
                        last_name=last_name,
                        email=email,
                        password=password
                    )
                    user.save()
                    django_login(request, user)
                    return redirect("/")  # Перенаправление на главную страницу

                else:
                    return render(request, "registrate.html", {"error": "Неправильный код доступа",
                                                               'first_name': first_name,
                                                               'last_name': last_name,
                                                               'email': email,
                                                               'password': first_password,
                                                               'confirm_password': second_password,
                                                               'verification_code': verification_code
                                                               })
            else:
                # Первый этап регистрации - отправка кода
                code = generate_verification_code()
                request.session['verification_code'] = code
                try:
                    send_mail(
                        'Verification Code',
                        f'Your verification code is {code}',
                        'kakoytann@gmail.com',
                        [email],
                        fail_silently=False,
                    )
                    # Отправляем код и показываем форму для ввода кода
                    return render(request, 'registrate.html', {
                        'show_verification_code': True,  # Параметр для отображения поля кода,
                        'first_name': first_name,
                        'last_name': last_name,
                        'email': email,
                        'password': first_password,
                        'confirm_password': second_password
                    })
                except Exception as ex:
                    print(ex)
                    return render(request, 'registrate.html', {'error': "Не удалось отправить код доступа",
                                                               'first_name': first_name,
                                                               'last_name': last_name,
                                                               'email': email,
                                                               'password': first_password,
                                                               'confirm_password': second_password
                                                               }
                                  )
        except json.JSONDecodeError as ex:
            print(ex)
            return render(request, 'registrate.html', {'error': 'Неверные данные JSON.'
                                                       })

    return render(request, 'registrate.html')


def send_verification_code(request, email):
    code = "".join(random.choices(string.digits, k=6))
    request.session['verification_code'] = code
    send_mail(
        'Код подтверждения',
        f'Ваш код подтверждения: {code}',
        settings.EMAIL_HOST_USER,
        [email],
        fail_silently=False,
    )
