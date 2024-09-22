import random
import string
import json

from django.contrib.auth import authenticate, login as django_login
from django.shortcuts import render
from django.core.mail import send_mail
from django.http import HttpResponse
from shop import settings
from django.http import JsonResponse
from .models import CustomUser


def index(request):
    if request.method == 'GET':
        return render(request, "index.html")


def test_load(request):
    return render(request, 'test.html')


def generate_verification_code(length=6):
    """Генерирует случайный код подтверждения."""
    return ''.join(random.choices(string.digits, k=length))


def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            email = data.get('email')
            password = data.get('password')

            user = authenticate(request, email=email, password=password)
            if user is not None:
                django_login(request, user)
                return JsonResponse(
                    {'success': True}
                )
            else:
                return JsonResponse(
                    {'success': False, 'message': 'Неправильная почта или пароль'}
                )
        except Exception as ex:
            return JsonResponse(
                {'success': False, 'message': f'Error {ex}'}
            )
    elif request.method == 'GET':
        return render(request, "login.html")


def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            verification_code = data.get('verification_code', None)

            if CustomUser.objects.filter(email=email).exists():
                return JsonResponse({"success": False, "message": "Почта уже зарегистрирована"})

            if verification_code:
                # Проверка кода
                stored_code = request.session.get('verification_code')
                if stored_code == verification_code:
                    # Код подтвержден
                    first_name = data.get('first_name')
                    last_name = data.get('last_name')
                    email = data.get('email')
                    password = data.get('password')
                    if not all([first_name, last_name, email, password]):
                        return JsonResponse({'success': False, 'message': 'Не хватает данных для регистрации.'})

                    user = CustomUser.objects.create_user(
                        first_name=first_name,
                        last_name=last_name,
                        email=email,
                        password=password
                    )
                    user.save()

                    return JsonResponse({'success': True, 'message': 'Пользователь зарегистрирован успешно!'})
                else:
                    return JsonResponse({'success': False, 'message': 'Некорректный код'})
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
                except Exception as ex:
                    return JsonResponse({'success': False, 'message': str(ex)})
                return JsonResponse({'success': True, 'message': 'Verification code sent.'})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON data.'})
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


def test_email(request):
    try:
        # Отправка тестового письма
        send_mail(
            'Test Email',  # Тема письма
            'hi',  # Тело письма
            settings.EMAIL_HOST_USER,  # Адрес отправителя
            ['dimaodincov3334@gmail.com'],  # Список получателей
            fail_silently=False  # Исключения при отправке не подавляются
        )
        # Возвращаем успешный ответ
        return HttpResponse(f"Successfully sent email. Request method: {request.method}, Path: {request.path}")
    except Exception as e:
        # Возвращаем сообщение об ошибке
        return HttpResponse(f"Failed to send email: {e}. Request method: {request.method}, Path: {request.path}")
