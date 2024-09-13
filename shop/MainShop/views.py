import random
import string
import json

from django.shortcuts import render
from django.core.mail import send_mail
from django.http import HttpResponse
from shop import settings
from django.http import JsonResponse


def generate_verification_code(length=6):
    """Генерирует случайный код подтверждения."""
    return ''.join(random.choices(string.digits, k=length))


def check_code(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email

def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            verification_code = data.get('verification_code', None)

            if verification_code:
                # Проверка кода
                stored_code = request.session.get('verification_code')
                if stored_code == verification_code:
                    # Код подтвержден
                    # Здесь должна происходить регистрация пользователя
                    return JsonResponse({'success': True, 'message': 'User registered successfully!'})
                else:
                    return JsonResponse({'success': False, 'message': 'Incorrect verification code.'})
            else:
                # Первый этап регистрации - отправка кода
                code = generate_verification_code()
                request.session['verification_code'] = code
                try:
                    send_mail(
                        'Verification Code',
                        f'Your verification code is {code}',
                        'kakoytann@gmail.com',  # Убедитесь, что это ваш email-адрес
                        [email],
                        fail_silently=False,
                    )
                except Exception as ex:
                    return JsonResponse({'success': False, 'message': str(ex)})
                return JsonResponse({'success': True, 'message': 'Verification code sent.'})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON data.'})
    return render(request, 'registrate.html')


def verify_code(request):
    if request.method == 'POST':
        entered_code = request.POST.get('verification_code')
        saved_code = request.session.get('verification_code')

        if entered_code == saved_code:
            # Код верный, продолжаем регистрацию
            return HttpResponse("Код подтвержден, регистрация успешна!")
        else:
            return HttpResponse("Неверный код подтверждения, попробуйте ещё раз.")


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
