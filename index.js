let request = require('request');
let Parser = require('rss-parser');
let parser = new Parser();
let fs = require('fs')
let config = require("./config.json")
let lastItem
let postsFound = []
fs.readFile('lastitem.json', 'utf8', function(err, content) {
    if(content) {
        lastItem = JSON.parse(content)
    }
});
fs.readFile('postsFound.json', 'utf8', function(err, content) {
    if(content) {
        let posts = JSON.parse(content)
        postsFound = posts.posts
        console.log(postsFound)
    }
});

setInterval(async () => {
    // target feed for program
    let feed = await parser.parseURL('https://www.vadso.kommune.no/ArtikkelRSS.ashx?NyhetsKategoriId=9&Spraak=Norsk');
    if(!lastItem || lastItem.guid != feed.items[0].guid) {
        console.log("OPPDATERING: " + Date.now())
        lastItem = feed.items[0]
        fs.writeFileSync("lastitem.json", JSON.stringify(lastItem))
        postsFound.push(feed.items[0])
        fs.writeFileSync("postsFound.json", '{"posts": ' + JSON.stringify(postsFound) + '}')
        await makeURI(feed.items[0].title, feed.items[0].link)
    }
}, 60000);


async function makeURI(title, link) {
    title = encodeURIComponent(title)
    link = encodeURIComponent(link)
    let URI = `https://graph.facebook.com/v5.0/me/feed?message=${title}&link=${link}&access_token=${config.access_token}`
    request({
        url: URI,
        method: 'POST'
    }, function(error, res, req){
        console.log(req)
    })
}