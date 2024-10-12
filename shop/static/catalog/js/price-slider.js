document.addEventListener("DOMContentLoaded", function() {
    const minHandle = document.getElementById('min-handle');
    const maxHandle = document.getElementById('max-handle');
    const sliderProcess = document.querySelector('.vue-slider-process');
    const sliderRail = document.querySelector('.vue-slider-rail');
    const sliderWidth = sliderRail.offsetWidth;

    let minValue = 0; // Минимальное значение
    let maxValue = 100; // Максимальное значение
    let currentMinValue = 10; // Текущая минимальная цена
    let currentMaxValue = 90; // Текущая максимальная цена

    function updateSlider() {
        const minPercent = (currentMinValue / maxValue) * 100;
        const maxPercent = (currentMaxValue / maxValue) * 100;

        minHandle.style.left = `${minPercent}%`;
        maxHandle.style.left = `${maxPercent}%`;
        sliderProcess.style.left = `${minPercent}%`;
        sliderProcess.style.width = `${maxPercent - minPercent}%`;
    }

    function handleDrag(handle, event) {
        const startX = event.pageX;
        const startValue = handle === minHandle ? currentMinValue : currentMaxValue;

        function onMouseMove(e) {
            const diff = e.pageX - startX;
            const movePercent = (diff / sliderWidth) * maxValue;
            const newValue = Math.min(Math.max(startValue + movePercent, minValue), maxValue);

            if (handle === minHandle && newValue < currentMaxValue) {
                currentMinValue = newValue;
            } else if (handle === maxHandle && newValue > currentMinValue) {
                currentMaxValue = newValue;
            }

            updateSlider();
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    minHandle.addEventListener('mousedown', function(event) {
        handleDrag(minHandle, event);
    });

    maxHandle.addEventListener('mousedown', function(event) {
        handleDrag(maxHandle, event);
    });

    updateSlider();
});
