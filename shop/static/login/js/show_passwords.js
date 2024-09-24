document.addEventListener('DOMContentLoaded', function() {
    const togglePassword1 = document.getElementById('togglePassword1');
    const password = document.querySelector("input[name='password']");

    togglePassword1.addEventListener('click', function() {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);

        // Меняем иконку при показе/скрытии пароля
        this.classList.toggle('zmdi-eye');
        this.classList.toggle('zmdi-lock');
    });
});
