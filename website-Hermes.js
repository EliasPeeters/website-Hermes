const express = require('express');
const bodyParser = require('body-parser');

app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');



let statusRoute = require('./routes/status');
let searchRoute = require('./routes/search');

let getPodcastEpisodes = require('./getPodcastEpisode')


app.listen(8086, () => {
    console.log(`Running on 8086`)
})