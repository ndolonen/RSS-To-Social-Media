const sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database('./db.sqlite3')
db.run(`DROP TABLE posts`)
db.close()