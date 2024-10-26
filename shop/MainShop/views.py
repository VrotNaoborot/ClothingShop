import random
import string
import json

from django.contrib.auth import authenticate, login as django_login
from django.shortcuts import render, redirect, get_object_or_404
from django.core.mail import send_mail
from django.http import HttpResponse
from shop import settings
from django.http import JsonResponse
from .models import CustomUser, Clothing, PriceHistory


def index(request):
    if request.method == 'GET':
        return render(request, "index.html")


def test_load(request):
    return render(request, 'test.html')


def product_card(request, pk):
    product = Clothing.objects.filter(pk=pk).prefetch_related('stock_set', 'category', 'colors', 'sizes').first()
    if product is not None:
        colors = product.colors.all()
        sizes = product.sizes.all()
        print(f"Colors - {colors}")
        return render(request, 'cardViewProduct.html', {'product': product, 'colors': colors, 'sizes': sizes})


def generate_verification_code(length=6):
    """Генерирует случайный код подтверждения."""
    return ''.join(random.choices(string.digits, k=length))


def mail_is_registrate(mail):
    return CustomUser.objects.filter(email=mail).exists()


def home(request):
    return render(request, "home.html")


def catalog(request):
    products = Clothing.objects.prefetch_related('stock_set', 'category').all()

    for product in products:
        # Получаем все записи истории цен для текущего продукта
        product.price_history = PriceHistory.objects.filter(clothing=product).order_by('-date_create')
        product.discount = None  # Инициализируем скидку

        # Проверяем, есть ли записи в истории цен
        if product.price_history.count() >= 2:
            old_price = product.price_history[1].price
            new_price = product.price_history[0].price

            # Рассчитываем скидку
            if new_price < old_price:
                product.discount = ((old_price - new_price) / old_price) * 100

            # Форматируем старую и новую цену с разделением тысяч
            product.old_price_formatted = f"{old_price:,}".replace(',', ' ')  # Заменяем запятую на пробел
            product.new_price_formatted = f"{new_price:,}".replace(',', ' ')  # Заменяем запятую на пробел
        elif product.price_history.count() == 1:
            product.new_price_formatted = f"{product.price_history[0].price:,}".replace(',', ' ')

    return render(request, 'catalog.html', {'products': products})



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
