document.addEventListener('DOMContentLoaded', function() {
    const registerButton = document.getElementById('registerButton');

    registerButton.addEventListener('click', function(event) {
        event.preventDefault();

        // Очистка предыдущих сообщений об ошибках
        const errorMessages = document.getElementById('errorMessages');
        errorMessages.textContent = '';

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const verificationCode = document.getElementById('verificationCode').value.trim();

        let errors = [];

        if (!firstName) {
            errors.push('Please enter your first name.');
        }

        if (!lastName) {
            errors.push('Please enter your last name.');
        }

        if (!email) {
            errors.push('Please enter your email address.');
        } else {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                errors.push('Please enter a valid email address.');
            }
        }

        if (!password) {
            errors.push('Please enter your password.');
        }

        if (password !== confirmPassword) {
            errors.push('Passwords do not match.');
        }

        if (errors.length > 0) {
            errorMessages.innerHTML = errors.join('<br>');
            return;
        }

        // Если все проверки прошли, показать скрытое поле
        document.getElementById('verificationCodeWrapper').style.display = 'block';

        // Дополнительные действия, такие как отправка данных на сервер, можно добавить здесь
    });
});
