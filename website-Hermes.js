const express = require('express');
const bodyParser = require('body-parser');

app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let statusRoute = require('./routes/status')

app.listen(8086, () => {
    console.log(`Running on 8086`)
})