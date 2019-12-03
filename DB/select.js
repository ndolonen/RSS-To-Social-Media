const sqlite3 = require('sqlite3').verbose()
 
let db = new sqlite3.Database('./db.sqlite3', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message)
  }
  console.log('Connected to the database.')
})
   
db.serialize(() => {
  db.each(`SELECT * FROM posts`, (err, row) => {
    if (err) {
      console.error(err.message)
    }
    console.log(row.id + "\t" + row.post_id + "\t" + row.post_title + "\t" + row.fb_id)
    })
})

db.close((err) => {
  if (err) {
    console.error(err.message)
  }
  console.log('Close the database connection.')
})