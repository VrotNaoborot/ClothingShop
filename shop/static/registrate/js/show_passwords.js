document.addEventListener('DOMContentLoaded', function() {
    const togglePassword1 = document.getElementById('togglePassword1');
    const passwordField1 = document.querySelector('input[name="password"]');

    const togglePassword2 = document.getElementById('togglePassword2');
    const passwordField2 = document.querySelector('input[name="confirm_password"]');

    // Показ/скрытие пароля для первого поля
    togglePassword1.addEventListener('click', function() {
        const type = passwordField1.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField1.setAttribute('type', type);
        this.classList.toggle('zmdi-eye');
        this.classList.toggle('zmdi-lock');
    });

    // Показ/скрытие пароля для второго поля
    togglePassword2.addEventListener('click', function() {
        const type = passwordField2.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField2.setAttribute('type', type);
        this.classList.toggle('zmdi-eye');
        this.classList.toggle('zmdi-lock');
    });
});
