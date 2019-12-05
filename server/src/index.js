'use strict'

const { initDatabase, allPages } = require('./repositories/pages')
const query = require('./models/query')

initDatabase(console.error, _ => console.log(query(allPages())('super mario')))
