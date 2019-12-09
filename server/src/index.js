'use strict'

const { initDatabase, allPages } = require('./repositories/pages')
const query = require('./models/query')
const L = require('list/curried')
const { time } = require('./utils')

console.time('start')
initDatabase.fork(console.error, _ => {
  console.timeEnd('start')
  const [executionTime, results] = time(query(allPages()))('java programming')
  const response = {
    topResults: L.toArray(L.take(5, results)),
    executionTime: executionTime / 1000,
    numResults: L.length(results)
  }
  console.log(response)
  console.log(L.toArray(L.take(5, results)))
})
