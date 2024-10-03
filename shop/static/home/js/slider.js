document.addEventListener("DOMContentLoaded", function() {
    function initializeSlider(sliderSelector, controlsSelector) {
        const slider = document.querySelector(sliderSelector);
        const slides = slider.querySelectorAll('.slide');
        const totalSlides = slides.length;
        const nextButton = document.querySelector(`${controlsSelector} .next`);
        const prevButton = document.querySelector(`${controlsSelector} .prev`);
        const slideNumber = document.querySelector(`${controlsSelector} .slide-number`);

        // Клонируем все слайды для создания бесконечной прокрутки
        slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            slider.appendChild(clone);
        });

        let currentIndex = 0;
        let slideWidth = slides[0].offsetWidth; // Ширина одного слайда
        let autoSlideInterval; // Переменная для хранения ID интервала

        // Функция для перемещения слайдера
        function slideNext() {
            currentIndex++;
            slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

            // Если мы дошли до конца оригинальных слайдов, быстро возвращаемся в начало
            if (currentIndex >= totalSlides) {
                setTimeout(() => {
                    slider.style.transition = 'none'; // Отключаем анимацию
                    currentIndex = 0; // Возвращаемся к первому слайду
                    slider.style.transform = `translateX(0)`; // Возвращаем положение
                    setTimeout(() => {
                        slider.style.transition = 'transform 0.5s ease'; // Включаем анимацию обратно
                    }, 50); // Небольшая задержка для плавности
                }, 500); // Задержка перед сбросом позиции
            }

            updateSlideNumber();
        }

        // Обновление номера текущего слайда
        function updateSlideNumber() {
            const displayedIndex = currentIndex % totalSlides; // Получаем индекс текущего слайда
            slideNumber.textContent = `${displayedIndex + 1} / ${totalSlides}`;
        }

        // Функция для автоматической прокрутки
        function startAutoSlide() {
            autoSlideInterval = setInterval(slideNext, 4000);
        }

        // Функция для остановки автоматической прокрутки
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        // Обработчики событий для кнопок навигации
        nextButton.addEventListener('click', () => {
            slideNext();
            stopAutoSlide(); // Останавливаем автоматическую прокрутку
            startAutoSlide(); // Запускаем ее заново
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; // Зацикливаем на последнем слайде
            slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            updateSlideNumber();
            stopAutoSlide(); // Останавливаем автоматическую прокрутку
            startAutoSlide(); // Запускаем ее заново
        });

        // Запуск автоматической прокрутки
        startAutoSlide();
    }

    // Инициализация слайдеров
    initializeSlider('.main-banner .slider', '.main-banner .slider-controls');
    initializeSlider('.second-banner .slider', '.second-banner .slider-controls');
});
