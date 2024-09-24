function startTimer() {
    let countdown = 60; // Счетчик
    const timerElement = document.getElementById('timer');
    const resendCodeText = document.getElementById('resendCodeText');

    resendCodeText.style.display = 'none'; // Скрыть текст "Resend Code"
    timerElement.style.display = 'inline'; // Показать таймер
    timerElement.textContent = `Отправить код повторно можно через ${countdown} секунд`;

    let timer = setInterval(function() {
        countdown--;
        if (countdown <= 0) {
            clearInterval(timer);
            timerElement.style.display = 'none'; // Скрыть таймер
            resendCodeText.style.display = 'inline'; // Показать текст "Resend Code"
        } else {
            timerElement.textContent = `Отправить код повторно можно через ${countdown} секунд`;
        }
    }, 1000);
}

function resendCode() {
    // Здесь должна быть логика повторной отправки кода
    alert('Код отправлен повторно');
    startTimer(); // Снова запускаем таймер после повторной отправки кода
}
