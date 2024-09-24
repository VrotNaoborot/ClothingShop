document.addEventListener('DOMContentLoaded', function() {
    const togglePassword1 = document.getElementById('togglePassword1');
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');

    const togglePassword2 = document.getElementById('togglePassword2');
    const confirmPassword = document.getElementById('confirmPassword');
    togglePassword1.addEventListener('click', function() {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        this.classList.toggle('zmdi-eye');
        this.classList.toggle('zmdi-lock');
    });
    togglePassword2.addEventListener('click', function() {
        const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPassword.setAttribute('type', type);
        this.classList.toggle('zmdi-eye');
        this.classList.toggle('zmdi-lock');
    });
    if (togglePassword && password) {
        togglePassword.addEventListener('click', function() {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            this.classList.toggle('zmdi-eye');
            this.classList.toggle('zmdi-lock');
        });
    }
});