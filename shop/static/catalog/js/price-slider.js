// Инициализация элементов при загрузке страницы
window.onload = function() {
    updateSliderValues();
}

// Получаем элементы слайдеров и полей ввода
let sliderOne = document.getElementById("slider-1");
let sliderTwo = document.getElementById("slider-2");
let minPriceInput = document.getElementById("minPrice");
let maxPriceInput = document.getElementById("maxPrice");
let minGap = 1; // Минимальная разница между ползунками
let sliderTrack = document.querySelector(".slider-track");

// Получаем минимальные и максимальные значения из полей ввода
const minValue = parseInt(minPriceInput.value);
const maxValue = parseInt(maxPriceInput.value);

// Функция для обновления значений слайдеров
function updateSliderValues() {
    sliderOne.value = minValue;
    sliderTwo.value = maxValue;
    fillColor(); // Обновляем цвет слайдера
}

// Обработка изменения первого слайдера
sliderOne.oninput = function() {
    if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
        sliderOne.value = parseInt(sliderTwo.value) - minGap; // Устанавливаем ползунок 1
    }
    minPriceInput.value = sliderOne.value; // Обновляем поле ввода
    fillColor(); // Обновляем цвет слайдера
}

// Обработка изменения второго слайдера
sliderTwo.oninput = function() {
    if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
        sliderTwo.value = parseInt(sliderOne.value) + minGap; // Устанавливаем ползунок 2
    }
    maxPriceInput.value = sliderTwo.value; // Обновляем поле ввода
    fillColor(); // Обновляем цвет слайдера
}

// Функция для обновления ползунков из полей ввода
function updateSliderFromInput() {
    let minPrice = Math.max(minValue, parseInt(minPriceInput.value) || minValue); // Устанавливаем минимум
    let maxPrice = Math.min(maxValue, parseInt(maxPriceInput.value) || maxValue); // Устанавливаем максимум

    // Ограничиваем вводимые значения
    if (minPrice + minGap > maxPrice) {
        maxPrice = minPrice + minGap; // Обновляем максимум, если разница меньше minGap
    }

    sliderOne.value = minPrice; // Обновляем ползунок 1
    sliderTwo.value = maxPrice; // Обновляем ползунок 2
    fillColor(); // Обновляем цвет слайдера
}

// Обновление значений слайдеров при потере фокуса
function adjustMinPrice() {
    let minPrice = parseInt(minPriceInput.value);
    if (isNaN(minPrice) || minPrice < minValue) {
        minPriceInput.value = minValue; // Устанавливаем минимальную цену на minValue
    }
    updateSliderFromInput(); // Обновляем слайдеры
}

function adjustMaxPrice() {
    let maxPrice = parseInt(maxPriceInput.value);
    if (isNaN(maxPrice) || maxPrice > maxValue) {
        maxPriceInput.value = maxValue; // Устанавливаем максимальную цену на maxValue
    }
    updateSliderFromInput(); // Обновляем слайдеры
}

// Функция для обновления цвета слайдера
function fillColor() {
    const percent1 = (sliderOne.value / maxValue) * 100; // Процент для первого слайдера
    const percent2 = (sliderTwo.value / maxValue) * 100; // Процент для второго слайдера
    sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}%, #3264fe ${percent1}%, #3264fe ${percent2}%, #dadae5 ${percent2}%)`;
}
