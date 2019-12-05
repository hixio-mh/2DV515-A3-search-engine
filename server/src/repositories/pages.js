'use strict'

const fs = require('fs')
const Async = require('crocks/Async')
const fanout = require('crocks/Pair/fanout')
const List = require('list/curried')
const { chain, concat, map, pipe } = require('ramda')
const merge = require('crocks/pointfree/merge')
const liftA2 = require('crocks/helpers/liftA2')
const sequence = require('crocks/pointfree/sequence')
const traverse = require('crocks/pointfree/traverse')
const Page = require('../types/Page')
const { words } = require('../utils')
const wordToId = require('../models/wordToId')

/** readdir :: String -> Async Error [String] */
const readdir = Async.fromNode(fs.readdir)

/** readFile :: String -> Async Error a */
const readFile = path => Async.fromNode(fs.readFile)(path, 'utf8')

/** fullPaths :: String -> Async Error [ Pair URL String ] */
const fullPaths = path =>
  readdir(path).map(
    map(fanout(concat('https://en.wikipedia.org/wiki/'), concat(path)))
  )

/** getAllPaths :: () -> Async Error [ String ] */
const getAllPaths = () =>
  liftA2(
    concat,
    fullPaths('./dataset/Words/Programming/'),
    fullPaths('./dataset/Words/Games/')
  )

/** readFiles :: Async Pair String String -> Async Pair String String */
const readFiles = pipe(
  map(map(traverse(Async, readFile))),
  chain(sequence(Async))
)

/** toPage :: Pair a (List String) -> Page */
const toPage = pipe(
  map(List.map(wordToId)),
  merge(Page.of)
)

/** toPages :: [ Pair String String ] -> List Page */
const toPages = pipe(
  map(map(words)),
  List.from,
  List.map(toPage)
)

/** readPages :: () -> Async Error (List Page) */
const readPages = pipe(
  getAllPaths,
  readFiles,
  map(toPages)
)

let pages = null

const initDatabase = (onError, onSuccess) => {
  readPages().fork(onError, ps => {
    pages = ps
    console.log('The pages are now available')
    onSuccess(ps)
  })
}

const allPages = () => pages

module.exports = {
  initDatabase,
  allPages
}
