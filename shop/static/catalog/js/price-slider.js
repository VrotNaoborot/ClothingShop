// Инициализация элементов при загрузке страницы
window.onload = function() {
    updateSliderValues();
    updateApplyButtonPrice(); // Проверяем состояние кнопки "Применить" при загрузке
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

// Получаем кнопку "Применить"
const applyBtn = document.querySelector("#fprice-menu .apply-btn");

// Получаем чекбоксы для других фильтров
const checkboxes = document.querySelectorAll("#fcolor-menu input[type='checkbox'], #fbrand-menu input[type='checkbox'], #fprice-menu input[type='checkbox']");

// Флаг для отслеживания состояния кнопки "Применить"
let isButtonActive = false;

// Функция для проверки состояния кнопки "Применить"
function updateApplyButtonPrice() {
    const isPriceChanged = (sliderOne.value !== minValue.toString() || sliderTwo.value !== maxValue.toString());
    const isInputChanged = (minPriceInput.value !== minValue.toString() || maxPriceInput.value !== maxValue.toString());
    const isAnyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked); // Проверьте, есть ли активные чекбоксы

    // Установите кнопку активной, если есть изменения и флаг не установлен
    if (!isButtonActive && (isAnyChecked || isPriceChanged || isInputChanged)) {
        applyBtn.disabled = false; // Активируем кнопку
        console.log("Активировано");
        isButtonActive = true; // Устанавливаем флаг
        minPriceInput.classList.add("sliderIsActive")
        maxPriceInput.classList.add("sliderIsActive")
    }
}

// Функция для обновления значений слайдеров
function updateSliderValues() {
    sliderOne.value = minValue;
    sliderTwo.value = maxValue;
    fillColor(); // Обновляем цвет слайдера
    updateApplyButtonPrice(); // Проверяем состояние кнопки "Применить"
}

// Обработка изменения первого слайдера
sliderOne.oninput = function() {
    if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
        sliderOne.value = parseInt(sliderTwo.value) - minGap; // Устанавливаем ползунок 1
    }
    minPriceInput.value = sliderOne.value; // Обновляем поле ввода
    fillColor(); // Обновляем цвет слайдера
    updateApplyButtonPrice(); // Проверяем состояние кнопки "Применить" при перемещении ползунка
}

// Обработка изменения второго слайдера
sliderTwo.oninput = function() {
    if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
        sliderTwo.value = parseInt(sliderOne.value) + minGap; // Устанавливаем ползунок 2
    }
    maxPriceInput.value = sliderTwo.value; // Обновляем поле ввода
    fillColor(); // Обновляем цвет слайдера
    updateApplyButtonPrice(); // Проверяем состояние кнопки "Применить" при перемещении ползунка
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
    updateApplyButtonPrice(); // Проверяем состояние кнопки "Применить" после обновления
}

function adjustMinPrice() {
    let minPrice = parseInt(minPriceInput.value);
    if (isNaN(minPrice) || minPrice < minValue) {
        minPriceInput.value = minValue; // Устанавливаем минимальную цену на minValue
    } else if (minPrice >= maxPriceInput.value) { // Проверка на превышение максимума
        minPriceInput.value = maxPriceInput.value - minGap; // Устанавливаем минимум ниже максимума
    }
    updateSliderFromInput(); // Обновляем слайдеры
}

function adjustMaxPrice() {
    let maxPrice = parseInt(maxPriceInput.value);
    if (isNaN(maxPrice) || maxPrice > maxValue) {
        maxPriceInput.value = maxValue; // Устанавливаем максимальную цену на maxValue
    } else if (maxPrice <= minPriceInput.value) { // Проверка на превышение минимума
        maxPriceInput.value = parseInt(minPriceInput.value) + minGap; // Устанавливаем максимум выше минимума
    }
    updateSliderFromInput(); // Обновляем слайдеры  
}
// Функция для обновления цвета слайдера
function fillColor() {
    console.log("fill color");
    const minValue = parseInt(sliderOne.min); // минимальное значение из атрибута min
    const maxValue = parseInt(sliderTwo.max); // максимальное значение из атрибута max
    const range = maxValue - minValue;

    // Вычисляем проценты для позиции ползунков относительно диапазона
    const percent1 = ((sliderOne.value - minValue) / range) * 100;
    const percent2 = ((sliderTwo.value - minValue) / range) * 100;

    // Устанавливаем цвет фона трека
    sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}%, #999 ${percent1}%, #999 ${percent2}%, #dadae5 ${percent2}%)`;
}

