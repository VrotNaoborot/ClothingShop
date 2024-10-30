import random
import string
import json
from django.db import models
from django.db.models import Prefetch
from django.contrib.auth import authenticate, login as django_login
from django.shortcuts import render, redirect, get_object_or_404
from django.core.mail import send_mail
from django.http import HttpResponse
from shop import settings
from django.http import JsonResponse
from .models import CustomUser, Clothing, PriceHistory, Stock, Color
from django.urls import reverse

from django.db.models import Q


def index(request):
    if request.method == 'GET':
        return render(request, "index.html")


def test_load(request):
    return render(request, 'test.html')


def product_card(request, pk, color_id):
    product = get_object_or_404(Clothing, id=pk)
    # Получаем объект цвета по color_id
    color = get_object_or_404(Color, id=color_id)

    stock_items = Stock.objects.filter(clothing=product, color=color, count__gt=0)
    stock_first_item = stock_items[0]
    price_history = PriceHistory.objects.filter(clothing=product).order_by('-date_create')
    colors = list(set(stock.color for stock in Stock.objects.filter(clothing=product, count__gt=0)))
    print(f"colors: {colors}")

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

    context = {'product': product,
               'colors': colors,
               'stock': stock_first_item,
               'current_color': color_id}

    return render(request, 'cardViewProduct.html', context=context)


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
    target_clothing_items = Clothing.objects.filter(Q(target=v) | Q(target='U'))
    print(f"Cl: {target_clothing_items}")
    available_clothing_items = []
    for clothing_item in target_clothing_items:
        stock_items = Stock.objects.filter(clothing=clothing_item, count__gt=0)
        if stock_items:
            stock_item_first = stock_items.first()
            clothing_item.image1 = stock_item_first.image1
            clothing_item.image2 = stock_item_first.image2
            color_obj = stock_item_first.color
            clothing_item.color_id = color_obj.id
            clothing_item.url = reverse('card', args=[clothing_item.id, stock_item_first.color_id])

            price_history = PriceHistory.objects.filter(clothing=clothing_item).order_by('-date_create')
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
            stock_for_color_item = Stock.objects.filter(clothing=clothing_item, count__gt=0, color=color_obj)

            clothing_item.sizes = sorted(set(stock.size for stock in stock_for_color_item), key=lambda s: s.value)
            available_clothing_items.append(clothing_item)
    return render(request, "home.html", {'popular_items': available_clothing_items})


def catalog(request):
    clothing_items = Clothing.objects.all()
    for item in clothing_items:
        # Все доступные в наличии цвета и размеры
        item.stock_items = Stock.objects.filter(clothing=item, count__gt=0)

        if item.stock_items.exists():
            first_stock_item = item.stock_items.first()
            item.color_id = first_stock_item.color.id
            item.size_id = first_stock_item.size.id
            item.url = reverse('card', args=[item.id, item.color_id])
            item.image1 = first_stock_item.image1
            item.image2 = first_stock_item.image2
        # available_colors = list(set(stock.color for stock in item.stock_items))

        # Получаем историю цен, отсортированную от новой даты к старой
        price_history = PriceHistory.objects.filter(clothing=item).order_by('-date_create')
        if len(price_history) == 1:
            item.discount = False
            current_price = price_history[0].price
            item.current_price = f"{current_price:,}".replace(',', ' ')
        elif len(price_history) >= 2:
            new_price = price_history[0].price
            old_price = price_history[1].price
            if new_price < old_price:
                item.discount = True
                item.old_price = f"{old_price:,}".replace(',', ' ')
                item.new_price = f"{new_price:,}".replace(',', ' ')
                item.discount_value = int(((old_price - new_price) / old_price) * 100)
            else:
                item.discount = False
                item.current_price = f"{price_history[0].price:,}".replace(',', ' ')

    return render(request, 'catalog.html', {'clothing_items': clothing_items})


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
