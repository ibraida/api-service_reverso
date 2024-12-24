const express = require('express');
const bodyParser = require('body-parser');
const Reverso = require('reverso-api');
const path = require('path');

const app = express();
const reverso = new Reverso();

// Настройка Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Установка папки для статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Обработка перевода
app.post('/translate', (req, res) => {
    const { phrase, sourceLang, targetLang } = req.body;

    reverso.getContext(phrase, sourceLang, targetLang)
        .then(response => {
            if (!response.examples || response.examples.length === 0) {
                return res.json({ examples: [] });
            }

            const examples = response.examples.map(example => ({
                source: example.source,
                target: example.target,
            }));

            res.json({ examples });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Произошла ошибка при обработке запроса.' });
        });
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
