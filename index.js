let Parser = require('rss-parser');
let parser = new Parser();

let lastDay = new Date(getFullYear() + "-" + getMonth() + "-" + getDate())

setInterval(async () => {
    let feed = await parser.parseURL('https://www.vadso.kommune.no/ArtikkelRSS.ashx?NyhetsKategoriId=9&Spraak=Norsk');
    let today = new Date(getFullYear() + "-" + getMonth() + "-" + getDate())
    let feedArray = []

    feed.items.forEach(item => {
        let today = new Date(getFullYear() + "-" + getMonth() + "-" + getDate())
        if(lastDay != today) {
            feedArray.clear()
            lastday = today
        }

        let now = new Date();
        let d = new Date(item.isoDate)
        
        let d1 = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate()
        let d2 = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate()
        
        if((d1 === d2) && (d.getMinutes >= now.getMinutes-5) && (true))
        {
            console.log(item)
        }  
    })

}, 1800);