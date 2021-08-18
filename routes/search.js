const fs = require('fs');
let Fuse = require('fuse.js');
const request = require('request');
const getPodcastEpisode = require('../getPodcastEpisode');

let hades = 'https://hades.eliaspeeters.de';
let zeus = 'https://eliaspeeters.de'

const fuseOptions = {
    // isCaseSensitive: false,
    includeScore: false,
    // shouldSort: true,
    // includeMatches: false,
    findAllMatches: true,
    minMatchCharLength: 1,
    location: 0,
    threshold: 0.3,
    // distance: 100,
    // useExtendedSearch: false,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
    keys: [
        'name',
        'element',
        'title',
        'description',
        'name',
        'dateReadable',
        'page',
        'url',
        'time',
        'type'
    ]
};

data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

data.all = []

function getHades() {
    request(`${hades}/attributes`, (err, res, body) => {
        let bodyJSON = JSON.parse(body).articles;
        bodyJSON.forEach(function(item) {
            item.page = `/article?name=${item.name}`
            item.name = item.heading;
            item.type = 'blog'
        });
        data.blog = bodyJSON
        bodyJSON.forEach(function(item) {
            data.all.push(item)
        });
    });
}


function loadData() {
    // add cv to all
    data.cv.forEach(function(item) {
        data.all.push(item)
    })

    // add pages to all
    data.page.forEach(function(item) {
        data.all.push(item)
    })

    getHades();


}

loadData();



app.get('/search/:search', (req, res) => {
    let searchTerm = req.params.search;
    console.log(searchTerm)
    const cvSearch = new Fuse(data.cv, fuseOptions).search(searchTerm);
    const blogSearch = new Fuse(data.blog, fuseOptions).search(searchTerm);
    const pageSearch = new Fuse(data.page, fuseOptions).search(searchTerm);
    const podcastSearch = new Fuse(data.podcast, fuseOptions).search(searchTerm);

    const topHit = new Fuse(data.all, fuseOptions).search(searchTerm);

    // console.log(topHit[0]);

    let resultData = {
        cvSearch: cvSearch, 
        blogSearch: blogSearch, 
        topHit: topHit[0],
        pageSearch: pageSearch,
        podcastSearch: podcastSearch
    }

    console.log(resultData)
    res.render('searchOutput', resultData)
    // res.send(`<div id="output" style="padding: 0px 20px 20px;"><h3>Pages</h3><div class="searchItem"><p onmousedown="openPage('/blog')">blog</p></div><h3>CV</h3><div class="searchItem"><p onmousedown="openPage('')">beispiel3</p></div></div>`)
})