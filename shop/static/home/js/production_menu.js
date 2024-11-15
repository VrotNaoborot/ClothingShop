
document.addEventListener('DOMContentLoaded', () => {
    const productionButton = document.querySelector('.header-production-button');
    const productionMenu = document.querySelector('.header-production-menu');

    productionButton.addEventListener('click', () => {
        productionMenu.classList.toggle('show');
    });

    // Закрываем меню при клике вне области
    document.addEventListener('click', (event) => {
        if (!productionButton.contains(event.target) && !productionMenu.contains(event.target)) {
            productionMenu.classList.remove('show');
        }
    });
});

