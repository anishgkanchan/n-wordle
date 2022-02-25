import {
  allFiveLetterWords,
  allSixLetterWords,
  allSevenLetterWords,
} from './WordConstants'

const isValidWord = function (wordEntered, wordLength) {
  let ret = false
  switch (wordLength) {
    case 5:
      ret = allFiveLetterWords.includes(wordEntered.toLowerCase())
      break
    case 6:
      ret = allSixLetterWords.includes(wordEntered.toLowerCase())
      break
    case 7:
      ret = allSevenLetterWords.includes(wordEntered.toLowerCase())
      break
    default:
      ret = false
  }
  return ret
}

export default isValidWord
