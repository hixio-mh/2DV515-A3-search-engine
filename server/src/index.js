const fs = require('fs')
const Async = require('crocks/Async')
const Pair = require('crocks/Pair')
const List = require('list/curried')
const {
  addIndex,
  compose,
  transduce,
  map,
  prop,
  reduce,
  filter
} = require('ramda')
const {
  chain,
  converge,
  merge,
  concat,
  identity,
  liftA2,
  pipe,
  sequence,
  traverse,
  bimap
} = require('crocks')
const Page = require('./types/Page')

const readdir = Async.fromNode(fs.readdir)
const readFile = path => Async.fromNode(fs.readFile)(path, 'utf8')

let pages = null

/** fullPaths :: String -> Async Error [ Pair URL String ] */
const fullPaths = path =>
  readdir(path).map(
    map(filename =>
      Pair('https://en.wikipedia.org/wiki/' + filename, path + filename)
    )
  )

/** words :: String -> List String */
const words = x => List.from(x.replace(/[()]/g).split(' '))

/** initWordToId :: () -> (String -> Number) */
const initWordToId = () => {
  const index = {}
  let size = -1
  return word => {
    if (index[word] != null) return index[word]
    else {
      index[word] = ++size
      return size
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

/** documentLocation :: List Number -> Page -> Number */
const locationScore = queryIds => ({ words }) =>
  reduce(
    (score, q) => {
      const index = List.indexOf(q, words)
      const increment = index >= 0 ? index + 1 : 1000000
      return score + increment
    },
    0,
    queryIds
  )

/** frequencyScore :: (List Number) -> Page -> Number */
const frequencyScore = queryIds =>
  pipe(
    prop('words'),
    reduce(
      (score, word) => (List.includes(word, queryIds) ? score + 1 : score),
      0
    )
  )

/** minimum :: Foldable m => m Number -> Number */
const minimum = reduce(Math.min, Infinity)

/** maximum :: Foldable m => m Number -> Number */
const maximum = reduce(Math.max, -Infinity)

const normalizeInverted = converge(
  (min, scores) => List.map(score => min / Math.max(score, 0.00001), scores),
  minimum,
  identity
)
const normalize = converge(
  (max, scores) => List.map(score => score / max, scores),
  scores => Math.max(maximum(scores), 0.00001),
  identity
)

const sequenceList = merge((l1, l2) =>
  addIndex(reduce)(
    (list, n, i) => List.append(Pair(n, List.nth(i, l2)), list),
    List.empty(),
    l1
  )
)

/** getScores :: (List Number) -> (List Page) -> Pair (List Number) (List Number) */
const getScores = queryIds =>
  reduce(
    (scores, page) =>
      scores.bimap(
        List.append(frequencyScore(queryIds)(page)),
        List.append(locationScore(queryIds)(page))
      ),
    Pair(List.empty(), List.empty())
  )

const getNormalizedScores = queryIds =>
  pipe(
    getScores(queryIds),
    bimap(normalize, normalizeInverted),
    sequenceList
  )

const results = pages =>
  pipe(
    addIndex(reduce)(
      (results, scores, i) =>
        scores.fst() > 0
          ? List.append(
            Pair(List.nth(i, pages), scores.fst()), // + 0.8 * scores.snd()),
            results
          )
          : results,
      List.empty()
    ),
    List.sortWith((a, b) => b.snd() - a.snd()),
    List.take(5),
    List.map(p => ({ url: p.fst().url, score: p.snd() }))
  )

const query = query => {
  const queryIds = List.map(wordToId, words(query))
  const scores = getNormalizedScores(queryIds)(pages)
  return results(pages)(scores)
}

/** readPages :: () -> Async Error (List Page) */
const readPages = pipe(
  allPaths,
  map(map(traverse(Async, readFile))),
  chain(sequence(Async)),
  map(map(map(words))),
  map(List.from),
  map(List.map(map(List.map(wordToId)))),
  map(List.map(merge(Page.of)))
)

readPages().fork(console.error, ps => {
  pages = ps
  console.log(List.toArray(query('java')))
})
