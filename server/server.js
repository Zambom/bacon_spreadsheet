const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: '*'
}));

app.post('/add', (req, res) => {
    console.log(req, req.body);

    res.json({ result: 1 });
});

app.listen(3001, '0.0.0.0');