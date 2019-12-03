const fs = require('fs')
const Async = require('crocks/Async')
const Pair = require('crocks/Pair')
const {
  map,
  chain,
  merge,
  concat,
  liftA2,
  pipe,
  sequence,
  traverse
} = require('crocks')
const Page = require('./types/Page')

const readdir = Async.fromNode(fs.readdir)
const readFile = path => Async.fromNode(fs.readFile)(path, 'utf8')

/** fullPaths :: String -> Async Error [ Pair URL String ] */
const fullPaths = path =>
  readdir(path).map(
    map(filename =>
      Pair('https://en.wikipedia.org/wiki/' + filename, path + filename)
    )
  )

/** words :: String -> [ String ] */
const words = x => x.replace(/[()]/g).split(' ')

/** initWordToId :: () -> (String -> Number) */
const initWordToId = () => {
  const index = {}
  let size = 0
  return word => {
    if (index[word]) return index[word]
    else {
      const id = size
      size++
      index[word] = id
      return id
    } 
  }
}

const wordToId = initWordToId() 

// allPaths :: () -> Async Error [ String ]
const allPaths = () =>
  liftA2(
    concat,
    fullPaths('./dataset/Words/Programming/'),
    fullPaths('./dataset/Words/Games/')
  )

/** toPages :: () -> Async Error [ Page ] */
const toPages = pipe(
  allPaths,
  map(map(traverse(Async, readFile))),
  chain(sequence(Async)),
  map(map(map(words))),
  map(map(map(map(wordToId)))),
  map(map(merge(Page.of)))
)

toPages().fork(console.error, console.log)
