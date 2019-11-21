let Parser = require('rss-parser');
let parser = new Parser();
let fs = require('fs')
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

// let lastDay = new Date(getFullYear() + "-" + getMonth() + "-" + getDate())

setInterval(async () => {
    //test with reddit
    let feed = await parser.parseURL('https://www.reddit.com/.rss');
    if(!lastItem || lastItem.id != feed.items[0].id) {
        console.log("OPPDATERING: " + Date.now())
        lastItem = feed.items[0]
        fs.writeFileSync("lastitem.json", JSON.stringify(lastItem))
        postsFound.push(feed.items[0])
        fs.writeFileSync("postsFound.json", '{"posts": ' + JSON.stringify(postsFound) + '}')
    }
    
    //target feed for program
    // let feed = await parser.parseURL('https://www.vadso.kommune.no/ArtikkelRSS.ashx?NyhetsKategoriId=9&Spraak=Norsk');
    // if(!lastItem || lastItem.guid != feed.items[0].guid) {
    //     console.log("OPPDATERING: " + Date.now())
    //     lastItem = feed.items[0]
    //     fs.writeFileSync("lastitem.json", JSON.stringify(lastItem))
    //     postsFound.push(feed.items[0])
    //     fs.writeFileSync("postsFound.json", '{"posts": ' + JSON.stringify(postsFound) + '}')
    // }
}, 60000);