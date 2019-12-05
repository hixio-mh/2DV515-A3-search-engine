'use strict'

const fs = require('fs')
const Async = require('crocks/Async')
const fanout = require('crocks/Pair/fanout')
const List = require('list/curried')
const { chain, concat, map, pipe, split } = require('ramda')
const liftA2 = require('crocks/helpers/liftA2')
const sequence = require('crocks/pointfree/sequence')
const traverse = require('crocks/pointfree/traverse')
const Page = require('../types/Page')
const { words, lines } = require('../utils')
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

/** getPageLinks :: String -> Async Error (Set String) */
const getPageLinks = path =>
  readdir(path)
    .chain(traverse(Async, pipe(concat(path), readFile, map(lines))))
    .map(List.from)

/** toWordIds :: String -> List Number */
const toWordIds = pipe(words, List.map(wordToId))

/** readPageFiles :: Async List Pair String String -> Async List (Pair String List Number) */
const readPageFiles = pipe(
  map(map(traverse(Async, pipe(readFile, map(toWordIds))))),
  chain(sequence(Async)),
  map(List.from)
)

/** getPageContent :: String -> Async List (Pair String List Number) */
const getPageContent = pipe (
  fullPaths,
  readPageFiles,
)

/** allPageLinks :: Async Error (List Set String) */
const allPageLinks =
  liftA2(
    List.concat,
    getPageLinks('./dataset/Links/Programming/'),
    getPageLinks('./dataset/Links/Games/'),
  )
    
/** allPageContent :: Async Error (List Pair String List Number) */
const allPageContent =
  liftA2(
    List.concat,
    getPageContent('./dataset/Words/Programming/'),
    getPageContent('./dataset/Words/Games/')
  )

/** toPage :: (Set String, Pair String List Number) -> Page */
const toPage = (links, {fst, snd}) => Page.of(fst(), snd(), links)

const readPages = () => 
  liftA2(
    List.zipWith(toPage),
    allPageLinks,
    allPageContent
  )

let pages = null

const savePages = ps => pages = ps || ps

const initDatabase = readPages().map(savePages)

const allPages = () => pages

module.exports = {
  initDatabase,
  allPages
}
