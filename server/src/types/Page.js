/**
 * Page ::
 *   { url   :: String
 *   , words :: List Number
 *   , links :: Set String
 *   }
 * @param {String} url
 * @param {List<Number>} words
 * @param {Set<String>} links
 */

const Page = (url, words, links) => ({ url, words, links })

module.exports = {
  of: Page
}
