const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: '*'
}));
app.use(express.json({ limit: '50mb' }));

app.post('/add', (req, res) => {
    const { params } = req.body;

    const result = params.map(a => a.value).reduce((a, b) => a + b);

    res.json({ result });
});

app.post('/sub', (req, res) => {
    const { params } = req.body;

    const result = params.map(a => a.value).reduce((a, b) => a - b);

    res.json({ result });
});

app.post('/mul', (req, res) => {
    const { params } = req.body;

    const result = params.map(a => a.value).reduce((a, b) => a * b);

    res.json({ result });
});

app.post('/div', (req, res) => {
    const { params } = req.body;

    const values = params.map(a => a.value);

    let result = 'error';

    if (values.indexOf(0) === -1 || values.indexOf(0) === 0) {
        result = values.reduce((a, b) => a / b);
    }

    res.json({ result });
});

app.listen(3001, '0.0.0.0');