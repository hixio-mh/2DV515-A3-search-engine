'use strict'

const { initDatabase, allPages } = require('./repositories/pages')
const query = require('./models/query')
const L = require('list')

console.time('start')
initDatabase(console.error, _ => {
  console.timeEnd('start')
  console.time('query')
  console.log(L.toArray(query(allPages())('super mario')))
  console.timeEnd('query')
})
