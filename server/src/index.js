'use strict'

const { initDatabase, allPages } = require('./repositories/pages')
const query = require('./models/query')
const L = require('list')

initDatabase(console.error, _ =>
  console.log(L.toArray(query(allPages())('super mario')))
)
