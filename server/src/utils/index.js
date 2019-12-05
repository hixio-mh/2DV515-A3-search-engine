'use strict'

const List = require('list/curried')
const isEmpty = require('crocks/predicates/isEmpty')
const not = require('crocks/logic/not')
const pipe = require('ramda/src/pipe')
const reduce = require('ramda/src/reduce')
const replace = require('ramda/src/replace')
const split = require('ramda/src/split')

/** minimum :: Foldable f => f Number -> Number */
const minimum = reduce(Math.min, Infinity)

/** maximum :: Foldable f => f Number -> Number */
const maximum = reduce(Math.max, -Infinity)

/** words :: String -> List String */
const words = pipe(
  replace(/[()]/g, ''),
  split(' '),
  List.from,
  List.filter(not(isEmpty))
)

/** lines :: String -> Set String */
const lines = pipe(
  split('\n'),
  xs => new Set(xs)
)

module.exports = {
  maximum,
  minimum,
  words,
  lines
}
