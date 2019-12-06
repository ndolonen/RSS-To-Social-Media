/*
  NOTE: 
  This program looks for an ID of a RSS post and checks if its the same as the last one.
  If its not its a new one and posts.
  The RSS this program was designed for was using a id named "guid", this might vary depending on the RSS source.
*/
require('dotenv').config()
let sqlite3 = require('sqlite3').verbose()
let fs = require('fs')
let request = require('request')
var Twit = require('twit')
let Parser = require('rss-parser')
let parser = new Parser()
const { BitlyClient } = require('bitly')
const bitly = new BitlyClient(process.env.BITLY_ACCESS_TOKEN, {})

// let startDate = new Date()
// console.log("Started: " + startDate.getUTCHours() + ":" + startDate.getUTCMinutes() + ":" + startDate.getUTCSeconds())

//setup of data to be stored
let lastItem = {
  "id": "",
  "post_id": "",
  "post_title": "",
  "fb_id": ""
}
getLast()

let T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60*1000,
  strictSSL: true,
})

//runs on a 1 minute interval and pings the RSS for updates
setInterval(async () => {
  // target feed for program
  let feed = await parser.parseURL(process.env.RSS)
  let post_id = feed.items[0].id || feed.items[0].guid
  //posts if there is no prior posts or if the last posts id is not the same as the new one.
  if(!lastItem.post_id || lastItem.post_id != post_id) {
    //console.log("New post: " + new Date().getTime())
    postToSocialMedia(feed.items[0].link, feed.items[0].title, feed.items[0].guid)
  }
}, 60000)

async function postToSocialMedia(link, title, post_id) {

  //Facebook
  let fb_id
  encodeTitle = encodeURIComponent(title)
  encodeLink = encodeURIComponent(link)
  let FACEBOOK_URI = `https://graph.facebook.com/v5.0/me/feed?message=${encodeTitle}&link=${encodeLink}&access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`
  request({
    url: FACEBOOK_URI,
    method: 'POST'
  }, function(err, res, req){
    if(err){
        writeError("URL", err)
    }
    if(req.error){
      writeError("API", req.error.message)
    }
    fb_id = JSON.parse(req).id
  })

  let bitlyLink

  let linkStr =  title + " " + link
  //Get a bitly link for twitter
  if( !linkStr || linkStr.length >= 279 )
  {
    try {
      bitlyLink = await bitly.shorten(link)
    } catch(e) {
      writeError("URL", err)
    }
    linkStr = title + " " + bitlyLink.url
  }

  //Twitter
  let twitter_id
  T.post('statuses/update', { status: linkStr }, function(err, data, response) {
    twitter_id = data.id_str
  })
  insertPost(post_id, title, fb_id, twitter_id)
}

//Gets the last field in the DB
async function getLast() {
  let db = new sqlite3.Database('./DB/db.sqlite3', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      writeError("CON", err)
    }
  })
      
  Select(db)

  await db.close((err) => {
    if (err) {
      writeError("CLO", err)
    }
  })
}

//selects the last field in the sqlite database
function Select(db) {
  db.each(`
    SELECT * 
    FROM   posts
    WHERE  ID = (
      SELECT MAX(ID)  
      FROM    posts
    )`, (err, row) => {
      if (err) {
        writeError("REA", err)
      }
      // console.log(typeof row.id)
      if(row){
        lastItem.id = "" + row.id
        lastItem.post_id = "" + row.post_id
        lastItem.post_title = "" + row.post_title
        lastItem.fb_id = "" + row.fb_id
      }
    }
  )
}

//insert new post into the database
function insertPost(post_id, post_title, fb_id) {
  let db = new sqlite3.Database('./DB/db.sqlite3')
   
  //inserts new post
  let sql = `INSERT INTO posts(post_id, post_title, fb_id) VALUES ('${post_id}', '${post_title}', '${fb_id}')`
  db.serialize(() => {
    db.run(sql, function(err) {
      if (err) {
        writeError("WRI", err)
        return
      }
      console.log(`Rows inserted ${this.changes}`)
    })
    Select(db)
  }) 
  db.close()
}

//writes errors to a .log file, the first 3 letters in the log tells you what kind of error it was.
/* 
writes errors to a .log file, the first 3 letters in the log tells you what kind of error it was.
Error codes:
WRI = Write
REA = Read
CON = Connect
CLO = Close
URL = URL
API = API

*/
function writeError(source, error) {
  let date = new Date()
  
  //sets the current date as the fileName  
  let fileName = source +
    date.getUTCFullYear().toString() + "_" + 
    date.getUTCMonth().toString() + "_" + 
    date.getUTCDate().toString() + "-" + 
    date.getUTCHours().toString() + "_" + 
    date.getUTCMinutes().toString() + "_" + 
    date.getUTCSeconds().toString() + ".log"
  
    //formats the error log
  let errorMessage = "" +
    date.getUTCFullYear().toString() + "/" + 
    date.getUTCMonth().toString() + "/" + 
    date.getUTCDate().toString() + " " + 
    date.getUTCHours().toString() + ":" + 
    date.getUTCMinutes().toString() + ":" + 
    date.getUTCSeconds().toString() + "\n\n" +
    error
  
  fs.writeFile(`./Error/${fileName}`, errorMessage, function (err) {
    if (err) throw err
    console.log(err)
  })
} 