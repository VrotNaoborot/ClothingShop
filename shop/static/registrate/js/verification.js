document.addEventListener('DOMContentLoaded', function() {
    const resendCodeText = document.getElementById('resendCodeText');
    const timerElement = document.getElementById('timer');
    let timer;
    let countdown = 60; // Таймер в секундах

    function startTimer() {
        resendCodeText.style.display = 'none'; // Скрыть текст "Resend Code"
        timerElement.style.display = 'inline'; // Показать таймер
        timerElement.textContent = `Отправить код повторно можно через ${countdown} секунд`;

        timer = setInterval(function() {
            countdown--;
            if (countdown <= 0) {
                clearInterval(timer);
                timerElement.style.display = 'none'; // Скрыть таймер
                resendCodeText.style.display = 'inline'; // Показать текст "Resend Code"
                countdown = 60; // Сброс таймера
            } else {
                timerElement.textContent = `Отправить код повторно можно через ${countdown} секунд`;
            }
        }, 1000);
    }

    function resendCode() {
        const email = document.getElementById('email').value.trim();

        if (!email) {
            alert('Пожалуйста, введите вашу почту перед повторной отправкой кода.');
            return;
        }

        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        fetch('/register/resend/', { // URL для повторной отправки кода
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({ email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Verification code sent successfully');
                startTimer(); // Запускаем таймер после успешной отправки кода
            } else {
                console.error('Failed to resend verification code');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    resendCodeText.addEventListener('click', resendCode);

    document.getElementById('registerButton').addEventListener('click', function(event) {
        event.preventDefault();

        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = '';  // Очистка предыдущего сообщения

            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const verificationCode = document.getElementById('verificationCode')?.value.trim();

            let error = '';

            // Функция для проверки введенных данных
            function validateForm() {
                if (!firstName) {
                    error = 'Пожалуйста, введите имя.';
                } else if (!lastName) {
                    error = 'Пожалуйста, введите фамилию.';
                } else if (!email) {
                    error = 'Пожалуйста, введите почту.';
                } else {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(email)) {
                        error = 'Пожалуйста, введите нормальный формат почты.';
                    }
                }

                if (!error && !password) {
                    error = 'Пожалуйста, введите пароль.';
                } else if (!error && password.length < 8) {
                    error = 'Длина пароля должна быть больше 8 символов.';
                }

                if (!error && password !== confirmPassword) {
                    error = 'Пароли не совпадают.';
                }

                if (error) {
                    errorMessage.textContent = error;
                    errorMessage.style.color = 'red'; // Сделать текст красным
                    errorMessage.style.fontSize = '16px'; // Сделать текст более крупным
                    errorMessage.style.textAlign = 'center'; // Выравнивание по центру
                    return false;
                }
                return true;
            }

            // Проверяем, видна ли форма для ввода кода подтверждения
            if (document.getElementById('verificationCodeWrapper').style.display === 'block') {
                // Вторичный запрос - проверка кода подтверждения
                if (!verificationCode) {
                    error = 'Пожалуйста, введите код подтверждения.';
                }

                // Проверяем введенные данные (на случай, если они могли измениться после первого запроса)
                if (!validateForm()) return;

                if (error) {
                    errorMessage.textContent = error;
                    errorMessage.style.color = 'red'; // Сделать текст красным
                    errorMessage.style.fontSize = '16px'; // Сделать текст более крупным
                    errorMessage.style.textAlign = 'center'; // Выравнивание по центру
                    return;
                }

                // Отправляем код подтверждения и все данные для регистрации на сервер
                const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

                fetch('/register/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    },
                    body: JSON.stringify({
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        password: password,
                        verification_code: verificationCode
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('User registered successfully');
                        alert('Регистрация завершена!');
                    } else {
                        errorMessage.textContent = data.message;
                        errorMessage.style.color = 'red'; // Сделать текст красным
                        errorMessage.style.fontSize = '16px'; // Сделать текст более крупным
                        errorMessage.style.textAlign = 'center'; // Выравнивание по центру

                        return;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });

            } else {
                // Первый запрос - регистрация и отправка кода подтверждения
                if (!validateForm()) return;

                // Отправка данных на сервер для отправки кода
                const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

                fetch('/register/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    },
                    body: JSON.stringify({
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        password: password
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Verification code sent successfully');

                        // Если сервер ответил успешно, показать скрытое поле для ввода кода подтверждения
                        document.getElementById('verificationCodeWrapper').style.display = 'block';
                        startTimer(); // Запускаем таймер после показа поля ввода кода
                    } else {
                        errorMessage.textContent = data.message;
                        errorMessage.style.color = 'red'; // Сделать текст красным
                        errorMessage.style.fontSize = '16px'; // Сделать текст более крупным
                        errorMessage.style.textAlign = 'center'; // Выравнивание по центру

                        return;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        } else {
            console.error("Element with id 'errorMessage' not found");
        }
    });
});
