document.getElementById('loginButton').addEventListener('click', function(event) {
    event.preventDefault(); // Предотвращаем отправку формы сразу

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    // Очистка предыдущих сообщений об ошибках
    errorMessage.textContent = '';

    // Простая валидация на клиенте
    if (!email) {
        errorMessage.textContent = 'Введите ваш email';
        return;
    }

    if (!password) {
        errorMessage.textContent = 'Введите ваш пароль';
        return;
    }

    // Подготовка данных для отправки
    const data = {
        email: email,
        password: password
    };

    // Отправка запроса на сервер
    fetch('/login/', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    })
    .then(response => response.json()) // Предполагаем, что сервер возвращает JSON
    .then(data => {
        if (data.success) {
            alert('Авторизация прошла успешно');
            window.location.href = '/';  // Перенаправление на главную страницу или другую
        } else {
            errorMessage.textContent = data.message || 'Неверный email или пароль';
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        errorMessage.textContent = 'Ошибка при авторизации';
    });
});
