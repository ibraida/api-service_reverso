let lastSelectedText = ''; // Переменная для хранения последнего выбранного текста
let timeoutId = null; // Таймер для задержки

document.getElementById('text').addEventListener('mouseup', function () {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    // Если выделенный текст не изменился или пустой, не отправляем запрос
    if (selectedText === lastSelectedText || selectedText === '') {
        return;
    }

    // Обновляем последний выделенный текст
    lastSelectedText = selectedText;

    // Очистка предыдущего таймера (если он был установлен)
    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    // Устанавливаем новый таймер
    timeoutId = setTimeout(async function () {
        // Получаем выбранные языки
        const sourceLang = document.getElementById('sourceLang').value;
        const targetLang = document.getElementById('targetLang').value;

        try {
            const response = await fetch('/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phrase: selectedText,
                    sourceLang: sourceLang,
                    targetLang: targetLang,
                }),
            });

            const data = await response.json();
            const popupElement = document.getElementById('popup');
            const popupResultsElement = document.getElementById('popupResults');
            popupResultsElement.innerHTML = ''; // Очистить предыдущие результаты

            if (data.examples && data.examples.length > 0) {
                data.examples.forEach(example => {
                    const li = document.createElement('li');
                    li.textContent = `${example.source} -> ${example.target}`;
                    popupResultsElement.appendChild(li);
                });

                // Показываем всплывающее окно
                const rect = selection.getRangeAt(0).getBoundingClientRect();
                popupElement.style.left = `${rect.right}px`;
                popupElement.style.top = `${rect.top}px`;
                popupElement.style.display = 'block';
            } else {
                popupResultsElement.innerHTML = '<li>Примеры не найдены.</li>';
                popupElement.style.display = 'block';
            }
        } catch (err) {
            console.error('Ошибка:', err);
            alert('Произошла ошибка при получении данных.');
        }
    }, 500); // Таймаут в 500 миллисекунд
});

// Закрытие всплывающего окна при клике вне его
document.addEventListener('click', function (event) {
    const popup = document.getElementById('popup');
    if (!popup.contains(event.target) && !window.getSelection().toString().trim()) {
        popup.style.display = 'none';
    }
});
