const sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database('./db.sqlite3')
db.run(`
  CREATE TABLE posts(
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    post_id STRING, 
    post_title STRING, 
    fb_id STRING,
    twitter_id STRING
  )
`)
db.close()