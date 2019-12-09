'use strict'

const { map } = require("list/curried")
const converge = require('crocks/combinators/converge')
const identity = require('crocks/combinators/identity')
const { maximum, minimum } = require('../utils')


/** normalize :: List Number -> List Number */
const normalize = converge(
  (max, scores) => map(score => score / max, scores),
  scores => Math.max(maximum(scores), 0.00001),
  identity
)

/** normalizeInverted :: List Number -> List Number */
const normalizeInverted = converge(
  (min, scores) => map(score => min / Math.max(score, 0.00001), scores),
  minimum,
  identity
)

module.exports = {
  normalize,
  normalizeInverted
}