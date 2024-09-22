document.addEventListener('DOMContentLoaded', () => {
    const mainImage = document.getElementById('main-image');
    const additionalImages = document.querySelectorAll('.additional-images');

    let currentIndex = -1; // Начнем с -1, чтобы основное изображение было первым

    mainImage.addEventListener('mouseenter', () => {
        currentIndex = 0; // Сброс индекса при наведении
        changeImage();
    });

    mainImage.addEventListener('mousemove', (e) => {
        const rect = mainImage.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;

        // Меняем индекс в зависимости от положения курсора
        if (e.clientX < centerX) {
            currentIndex = Math.max(0, currentIndex - 1);
        } else {
            currentIndex = Math.min(additionalImages.length - 1, currentIndex + 1);
        }

        // Убедимся, что индекс не выходит за пределы
        if (currentIndex >= additionalImages.length) {
            currentIndex = additionalImages.length - 1;
        } else if (currentIndex < 0) {
            currentIndex = 0;
        }

        changeImage();
    });

    mainImage.addEventListener('mouseleave', () => {
        currentIndex = -1; // Возврат к основному изображению
        changeImage();
    });

    function changeImage() {
        if (currentIndex === -1) {
            mainImage.src = mainImage.dataset.src; // Возврат к основному изображению
        } else {
            const currentImage = additionalImages[currentIndex];
            mainImage.src = currentImage.src;
        }
    }
});
