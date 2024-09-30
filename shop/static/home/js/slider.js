document.addEventListener("DOMContentLoaded", function() {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    const nextButton = document.querySelector('.next');
    const prevButton = document.querySelector('.prev');
    const slideNumber = document.querySelector('.slide-number');

    // Клонируем все слайды для создания бесконечной прокрутки
    slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        slider.appendChild(clone);
    });

    let currentIndex = 0;
    let slideWidth = slides[0].offsetWidth; // Ширина одного слайда
    let totalWidth = slideWidth * (totalSlides * 2); // Общая ширина всех слайдов с клонами

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

    // Обработчики событий для кнопок навигации
    nextButton.addEventListener('click', () => {
        slideNext();
    });

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; // Зацикливаем на последнем слайде
        slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        updateSlideNumber();
    });

    // Автоматическая прокрутка каждые 2 секунды
    setInterval(slideNext, 4000);
});
