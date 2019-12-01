const fs = require('fs')

fs.readFile('./dataset/Words/Programming/Abstraction_(computer_science)', 'utf8', (err, data) => 
  err ? console.error(err) : console.log(data.replace(/[()]/g, '').split(' '))
)