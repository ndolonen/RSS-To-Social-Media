let Parser = require('rss-parser');
let parser = new Parser();
let fs = require('fs')
let lastItem
fs.readFile('lastitem.json', 'utf8', function(err, contents) {
    lastItem = JSON.parse(contents)
});

// let lastDay = new Date(getFullYear() + "-" + getMonth() + "-" + getDate())

setInterval(async () => {
    let feed = await parser.parseURL('https://www.vadso.kommune.no/ArtikkelRSS.ashx?NyhetsKategoriId=9&Spraak=Norsk');
    if(!lastItem) {
        lastItem = feed.items[0]
        // console.log(JSON.stringify(lastItem))
        fs.writeFileSync("lastitem.json", JSON.stringify(lastItem))
    }
    if(lastItem.guid != feed.items[0].guid) {
        console.log("True")
    }
    else {
        console.log("False")
    }

    // let today = new Date(getFullYear() + "-" + getMonth() + "-" + getDate())
    // let feedArray = []

    // feed.items.forEach(item => {

    //     let today = new Date(getFullYear() + "-" + getMonth() + "-" + getDate())
    //     if(lastDay != today) {
    //         feedArray.clear()
    //         lastday = today
    //     }

    //     let now = new Date();
    //     let d = new Date(item.isoDate)
        
    //     let d1 = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate()
    //     let d2 = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate()
        
    //     if((d1 === d2) && (d.getMinutes >= now.getMinutes-5) && (true))
    //     {
    //         console.log(item)
    //     }  
    // })

}, 1800);