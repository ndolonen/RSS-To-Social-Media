const sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database('./db.sqlite3')
db.run(`DELETE FROM posts`)
db.close()