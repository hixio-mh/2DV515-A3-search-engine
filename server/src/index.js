const fs = require('fs')
const Async = require('crocks/Async')
const { map, concat, flip, liftA2 } = require('crocks')

const prepend = flip(concat)

const readdir = Async.fromNode (fs.readdir)

const fullPaths = path => readdir(path).map (map (prepend (path)))

// Async Error [String]
const allPaths = liftA2(
  concat,
  fullPaths('./dataset/Words/Programming/'),
  fullPaths('./dataset/Words/Games/')
)

allPaths.fork(console.error, console.log)