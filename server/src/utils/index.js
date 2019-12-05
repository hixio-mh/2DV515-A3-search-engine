'use strict'

const List = require('list/curried')
const replace = require('ramda/src/replace')
const split = require('ramda/src/split')
const pipe = require('ramda/src/pipe')
const not = require('crocks/logic/not')
const isEmpty = require('crocks/predicates/isEmpty')

/** words :: String -> List String */
const words = pipe(
  replace(/[()]/g, ''),
  split(' '),
  List.from,
  List.filter(not(isEmpty))
)

module.exports = {
  words
}
