document.querySelectorAll('.rating').forEach(function(ratingElement) {
    const rating = ratingElement.getAttribute('data-rating'); // Получаем рейтинг
    if (rating) {
        ratingElement.style.setProperty('--rating', rating); // Устанавливаем переменную
        console.log("finish");
    }
});
