const { Console } = require('console');
const fs = require('fs');
let Fuse = require('fuse.js');
const request = require('request');
const getPodcastEpisode = require('../getPodcastEpisode');

let hades = 'https://hades.eliaspeeters.de';
let zeus = 'https://eliaspeeters.de';
let ares = 'http://ares.eliaspeeters.de';

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

function getAres() {
    request(`${ares}/attributes`, (err, res, body) => {
        
        let bodyJSON = JSON.parse(body);
        let keys = Object.keys(bodyJSON);
        papers = []
        keys.forEach(function(item) {
            papers.push({
                page: `/onepaper?name=${bodyJSON[item].name}`,
                name: bodyJSON[item].heading,
                type: 'paper',
                description: bodyJSON[item].description
            })
        });
        
        data.paper = papers;

        papers.forEach(function(item) {
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
    getAres();

}

loadData();

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

function getTopHit(searchTerm) {
    let inputArray = []
    let topHitSearch = new Fuse(data.all, fuseOptions).search(searchTerm);
    if (topHitSearch != 0) {
        inputArray.push(topHitSearch[0].item);
    }
    return inputArray;
}

console.log(getTopHit('tsv fdv'))


app.get('/search/:search', (req, res) => {
    let searchTerm = req.params.search;
    var topHit = [];
    let inCV = [];
    if (isNumeric(searchTerm)) {
        let date = parseInt(searchTerm);
        for (let i = 0; i < data.cv.length; i++) {
            if (data.cv[i].begin <= date && data.cv[i].end >= date) {
                inCV.push(data.cv[i])
            }
        }

        if (inCV.length == 0) {
            topHit = getTopHit(searchTerm)
        }
    } else { 
        topHit = getTopHit(searchTerm)
    }

    const cvSearch = new Fuse(data.cv, fuseOptions).search(searchTerm);
    const blogSearch = new Fuse(data.blog, fuseOptions).search(searchTerm);
    const paperSearch = new Fuse(data.paper, fuseOptions).search(searchTerm);
    const pageSearch = new Fuse(data.page, fuseOptions).search(searchTerm);
    const podcastSearch = new Fuse(data.podcast, fuseOptions).search(searchTerm);

    const search = [
        {name: 'CV', data: cvSearch},
        {name: 'Blog', data: blogSearch},
        {name: 'Paper', data: paperSearch},
        {name: 'Pages', data: pageSearch},
        {name: 'Podcast', data: podcastSearch}
    ]

    let emptySearch = (topHit.length == 0 && inCV.length == 0) ? true : false;
    

    let resultData = {
        cvSearch: cvSearch, 
        blogSearch: blogSearch, 
        topHit: topHit[0],
        inCV: inCV,
        pageSearch: pageSearch,
        podcastSearch: podcastSearch,
        searchTerm: searchTerm,
        paperSearch: paperSearch,
        search,
        emptySearch: emptySearch
    }
    console.log(paperSearch)

    res.render('searchOutput', resultData)
})