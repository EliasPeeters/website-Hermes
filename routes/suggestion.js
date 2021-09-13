let search = require('./search'); 

function getRandomElement() {
    return search.data.all[Math.floor(Math.random()*search.data.all.length)];
}

app.get('/suggestion', (req, res) => {
    let suggestions = []
    suggestions.push({
        name: (Math.floor(Math.random()*13)+2008)
    })
    for (let i = 0; i < 5; i++) {
        suggestions.push(getRandomElement())
    }
    res.render('suggestionsOutput', {suggestions})
});