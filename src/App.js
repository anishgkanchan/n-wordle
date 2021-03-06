import './App.css'
import React, { Component } from 'react'
import Keyboard from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'
import './keyboardTheme.css'
import cloneDeep from 'lodash/cloneDeep'
import {
  allFiveLetterWords,
  allSixLetterWords,
  allSevenLetterWords,
} from './WordConstants'
import isValidWord from './AppUtils'

class App extends Component {
  constructor() {
    super()
    this.state = {
      activeRow: { 5: 0, 6: 0, 7: 0 },
      wordLength: '5',
      showAlert: false,
      solved: {
        5: false,
        6: false,
        7: false,
      },
    }
    this.secretWord = {
      5: allFiveLetterWords[
        Math.floor(Math.random() * allFiveLetterWords.length)
      ],
      6: allSixLetterWords[
        Math.floor(Math.random() * allSixLetterWords.length)
      ],
      7: allSevenLetterWords[
        Math.floor(Math.random() * allSevenLetterWords.length)
      ],
    }
    console.log(this.secretWord)
    this.inputElements = {}
    this.count = 0
    this.alertText = ''
    this.items = {
      5: [0, 1, 2, 3, 4],
      6: [0, 1, 2, 3, 4, 5],
      7: [0, 1, 2, 3, 4, 5, 6],
    }
    this.rowCount = {
      5: [0, 1, 2, 3, 4, 5],
      6: [0, 1, 2, 3, 4, 5, 6],
      7: [0, 1, 2, 3, 4, 5, 6, 7],
    }

    this.rowBackgroundColor = {
      0: '#79DC78',
      1: '#79DC78',
      2: '#BFEF88',
      3: '#FFED7F',
      4: '#FFBF7F',
      5: '#FF6666',
      6: '#A80900',
      7: '#A80900',
    }
    const defaultKeyTheme = {
      green: {},
      white: {
        A: 'A',
        B: 'B',
        C: 'C',
        D: 'D',
        E: 'E',
        F: 'F',
        G: 'G',
        H: 'H',
        I: 'I',
        J: 'J',
        K: 'K',
        L: 'L',
        M: 'M',
        N: 'N',
        O: 'O',
        P: 'P',
        Q: 'Q',
        R: 'R',
        S: 'S',
        T: 'T',
        U: 'U',
        V: 'V',
        W: 'W',
        X: 'X',
        Y: 'Y',
        Z: 'Z',
        '{bksp}': '{bksp}',
        '{enter}': '{enter}',
      },
      grey: {},
      yellow: {},
    }
    this.highlightedChars = {
      5: cloneDeep(defaultKeyTheme),
      6: cloneDeep(defaultKeyTheme),
      7: cloneDeep(defaultKeyTheme),
    }

    this.wordsSubmitted = { 5: [], 6: [], 7: [] }
    this.last_char = ''
    this.colors = {
      green: 'button-default-theme-override-highlight-green',
      white: 'button-default-theme-override',
      yellow: 'button-default-theme-override-highlight-yellow',
      grey: 'button-default-theme-override-highlight-grey',
    }
    this.grey = '#AAAAAA'
    this.green = '#20B2AA'
    this.yellow = '#F1C359'
    this.colorRules = {}
  }

  componentDidMount() {
    const { activeRow, wordLength } = this.state
    console.log('componentDidMount called')
    console.log(this.inputElements)
    if (activeRow[wordLength] < this.rowCount[wordLength].length) {
      this.inputElements[`r${activeRow[wordLength]}c${this.count}`].focus()
    }
  }

  componentDidUpdate() {
    const { activeRow, wordLength } = this.state
    console.log('componentDidUpdate called', this.inputElements)
    if (activeRow[wordLength] < this.rowCount[wordLength].length) {
      this.inputElements[`r${activeRow[wordLength]}c${this.count}`].focus()
    }
  }

  // This is for virtual keyboard events
  onKeyReleased = (button) => {
    const { wordLength, activeRow, solved, showAlert } = this.state
    console.log(
      'onKeyReleased called',
      button,
      this.inputElements[`r${activeRow[wordLength]}c${this.count}`].value
    )
    // when puzzle is solved or alert is showing input is disabled (which prevents physical keyboard inputs)
    // but virtual keyboard input needs to be explicitly handled
    if (showAlert || solved[wordLength]) {
      return
    }
    if (button === '{bksp}') {
      console.log('bksp is pressed')
      if (
        this.inputElements[`r${activeRow[wordLength]}c${this.count}`].value ===
          '' &&
        this.count > 0
      ) {
        this.count -= 1
      }
      this.inputElements[`r${activeRow[wordLength]}c${this.count}`].focus()
      this.inputElements[`r${activeRow[wordLength]}c${this.count}`].value = ''
    } else if (
      button === '{enter}' &&
      this.count === wordLength - 1 &&
      this.inputElements[`r${activeRow[wordLength]}c${this.count}`].value !== ''
    ) {
      console.log('Button pressed', button, this.count)
      console.log(this.inputElements[`r${activeRow[wordLength]}c${this.count}`])
      this.count = 0

      const wordEntered = this.items[wordLength]
        .map(
          (item) =>
            this.inputElements[`r${activeRow[wordLength]}c${item}`].value
        )
        .join('')

      if (isValidWord(wordEntered, wordLength)) {
        console.log('activeRow is updated')
        this.count = 0
        this.wordsSubmitted[wordLength].push(wordEntered)
        this.processResult()
        const newActiveRow = { ...activeRow }
        newActiveRow[wordLength] += 1
        console.log('wordEntered', wordEntered, this.secretWord[wordLength])
        if (wordEntered.toLowerCase() === this.secretWord[wordLength]) {
          const newSolved = { ...solved }
          newSolved[wordLength] = true
          this.alertText = 'Congratulations, good job!'
          this.setState(
            { activeRow: newActiveRow, showAlert: true, solved: newSolved },
            () => {
              setTimeout(() => {
                this.setState({
                  showAlert: false,
                })
              }, 2000)
            }
          )
        } else {
          this.setState({ activeRow: newActiveRow })
        }
      } else {
        console.log("word doesn't exist", wordEntered)
        this.alertText = 'Word not found!'
        this.count = 0
        this.setState(
          {
            showAlert: true,
          },
          () => {
            setTimeout(() => {
              this.setState({
                showAlert: false,
              })
            }, 2000)
          }
        )
      }
    } else if (
      (button.charCodeAt(0) >= 'a'.charCodeAt(0) &&
        button.charCodeAt(0) <= 'z'.charCodeAt(0)) ||
      (button.charCodeAt(0) >= 'A'.charCodeAt(0) &&
        button.charCodeAt(0) <= 'Z'.charCodeAt(0))
    ) {
      console.log('hello 1')
      this.inputElements[`r${activeRow[wordLength]}c${this.count}`].value =
        button
      if (this.count < wordLength - 1) {
        this.count += 1
      }
      this.inputElements[`r${activeRow[wordLength]}c${this.count}`].focus()
    } else {
      this.inputElements[`r${activeRow[wordLength]}c${this.count}`].focus()
    }
  }

  // This is for physical keyboard events only letters
  onChangeInput = (event) => {
    const { activeRow, wordLength } = this.state
    console.log('Entered onChangeInput', wordLength, event.target.value)

    if (event.target.value !== '') {
      if (this.count < wordLength - 1) this.count += 1
      this.inputElements[`r${activeRow[wordLength]}c${this.count}`].focus()
    } else {
      if (this.last_char === '' && this.count > 0) {
        this.count -= 1
      }
      this.inputElements[this.count].focus()
    }
    this.last_char = event.target.value
  }

  // This is for physical keyboard events for enter/bksp/invalid letters
  handleKeyDown = (event) => {
    const { wordLength, activeRow, showAlert, solved } = this.state
    console.log(
      'Entered handleKeyDown',
      wordLength,
      event,
      this.count,
      showAlert
    )
    if (
      !(
        (event.keyCode >= 'a'.charCodeAt(0) &&
          event.key <= 'z'.charCodeAt(0)) ||
        (event.keyCode >= 'A'.charCodeAt(0) &&
          event.keyCode <= 'Z'.charCodeAt(0))
      )
    ) {
      console.log('returning')
      event.preventDefault()
    }
    if (event.key === 'Backspace') {
      if (event.target.value === '' && this.count > 0) {
        this.count -= 1
      }
      this.inputElements[`r${activeRow[wordLength]}c${this.count}`].focus()
      this.inputElements[`r${activeRow[wordLength]}c${this.count}`].value = ''
    } else if (
      event.key === 'Enter' &&
      this.count === wordLength - 1 &&
      this.inputElements[`r${activeRow[wordLength]}c${this.count}`].value !== ''
    ) {
      const wordEntered = this.items[wordLength]
        .map(
          (item) =>
            this.inputElements[`r${activeRow[wordLength]}c${item}`].value
        )
        .join('')
      console.log('Word entered handleKeyDown', wordEntered)

      if (isValidWord(wordEntered, wordLength)) {
        console.log('activeRow is updated')
        this.count = 0
        this.wordsSubmitted[wordLength].push(wordEntered)
        this.processResult()
        const newActiveRow = { ...activeRow }
        newActiveRow[wordLength] += 1

        if (wordEntered.toLowerCase() === this.secretWord[wordLength]) {
          console.log('Congratulations, good job!')

          const newSolved = { ...solved }
          newSolved[wordLength] = true
          this.alertText = 'Congratulations, good job!'
          this.setState(
            { activeRow: newActiveRow, showAlert: true, solved: newSolved },
            () => {
              setTimeout(() => {
                this.setState({
                  showAlert: false,
                })
              }, 2000)
            }
          )
        } else {
          this.setState({ activeRow: newActiveRow })
        }
      } else {
        console.log("word doesn't exist", wordEntered)
        this.alertText = 'Word not found!'
        this.count = 0
        this.setState(
          {
            showAlert: true,
          },
          () => {
            setTimeout(() => {
              this.setState({
                showAlert: false,
              })
            }, 2000)
          }
        )
      }
    }
  }

  onChangeSelection = (event) => {
    console.log(
      'hello onChangeSelection',
      event,
      event.currentTarget,
      this,
      this.inputElements
    )
    this.count = 0
    this.clearAllInputs()
    console.log(this.inputElements)
    this.setState({ wordLength: event.currentTarget.value })
  }

  // handleFocusViaCapturing = (event) => {
  //   console.log('focus occurred on div', event)
  //   event.stopPropagation()
  //   return false
  // }

  // handleMouseDownViaCapturing = (event) => {
  //   console.log('mouse down occurred on div', event)
  //   event.stopPropagation()
  //   return false
  // }

  // handleClickViaCapturing = (event) => {
  //   console.log('click occurred on div', event)
  //   event.stopPropagation()
  //   return false
  // }

  // handleClick = (event) => {
  //   console.log('click occurred on input!', event)
  // }

  // handleMouseDown = (event) => {
  //   console.log('mouse down occurred on input!', event)
  // }

  // handleFocus = (event) => {
  //   console.log('focus occurred!', event)
  // }

  handleBlur = (event) => {
    const { activeRow, wordLength } = this.state
    console.log('blur occurred!', event)
    this.inputElements[`r${activeRow[wordLength]}c${this.count}`].focus()
  }

  onChange = () => {
    const { activeRow, wordLength } = this.state
    console.log('onChange occurred!', this.count)
    this.inputElements[`r${activeRow[wordLength]}c${this.count}`].focus()
  }

  clearAllInputs() {
    const { wordLength } = this.state
    for (let j = 0; j < 6; j += 1) {
      for (let i = 0; i < wordLength; i += 1) {
        console.log(i)
        this.inputElements[`r${j}c${i}`].value = ''
        console.log(this.inputElements[`r${j}c${i}`].value)
      }
    }
  }

  processResult() {
    const { activeRow, wordLength } = this.state
    console.log('reached here', activeRow)
    this.items[wordLength].forEach((item) => {
      console.log(
        'checking for ',
        this.inputElements[`r${activeRow[wordLength]}c${item}`].value
      )
      const inputChar =
        this.inputElements[
          `r${activeRow[wordLength]}c${item}`
        ].value.toUpperCase()
      if (
        inputChar === this.secretWord[wordLength].charAt(item).toUpperCase()
      ) {
        this.colorRules[`w${wordLength}r${activeRow[wordLength]}c${item}`] =
          this.green
        delete this.highlightedChars[wordLength].white[inputChar]
        delete this.highlightedChars[wordLength].yellow[inputChar]
        this.highlightedChars[wordLength].green[inputChar] = inputChar
      } else if (
        this.secretWord[wordLength]
          .toUpperCase()
          .includes(inputChar.toUpperCase())
      ) {
        this.colorRules[`w${wordLength}r${activeRow[wordLength]}c${item}`] =
          this.yellow
        delete this.highlightedChars[wordLength].grey[inputChar]
        delete this.highlightedChars[wordLength].white[inputChar]
        this.highlightedChars[wordLength].yellow[inputChar] = inputChar
      } else {
        this.colorRules[`w${wordLength}r${activeRow[wordLength]}c${item}`] =
          this.grey
        delete this.highlightedChars[wordLength].white[inputChar]
        this.highlightedChars[wordLength].grey[inputChar] = inputChar
      }
      console.log(
        this.colorRules,
        'highlighted',
        this.highlightedChars[wordLength]
      )
    })
  }

  renderInput(row, colorRules) {
    const { activeRow, isDisabled, wordLength, solved, showAlert } = this.state
    console.log('renderInput called', isDisabled, colorRules, showAlert)
    const nInputs = this.items[wordLength].map((item) => {
      const word = this.wordsSubmitted[wordLength]
      console.log(
        word.length > row && word[row] !== null ? word[row].charAt(0) : ''
      )
      console.log('wordsSubmitted is ', this.wordsSubmitted)
      console.log('word is ', wordLength, word, word[row], row)
      return (
        <input
          // if puzzle is solved or an alert is showing,
          // then disable current row input
          // otherwise disable all but the current row inputs
          disabled={
            solved[wordLength] || showAlert
              ? true
              : activeRow[wordLength] !== row
          }
          ref={(input) => {
            this.inputElements[`r${row}c${item}`] = input
          }}
          pointerEvents="none"
          onChange={this.onChangeInput}
          onKeyDown={this.handleKeyDown}
          onMouseDown={this.handleMouseDown}
          onClick={this.handleClick}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          type="text"
          inputMode="none"
          maxLength="1"
          pattern="[a-zA-Z]{1}"
          style={{
            fontSize: '30px',
            caretColor: 'transparent',
            cursor: 'default',
            textTransform: 'uppercase',
            textAlign: 'center',
            width: '30px',
            height: '30px',
            backgroundColor: `${
              colorRules != null &&
              Object.prototype.hasOwnProperty.call(
                colorRules,
                `w${wordLength}r${row}c${item}`
              )
                ? colorRules[`w${wordLength}r${row}c${item}`]
                : 'white'
            }`,
            color: `${activeRow[wordLength] !== row ? 'white' : 'black'}`,
            fontWeight: 'bold',
            margin: '2px',
            padding: '5px',
          }}
          defaultValue={`${
            word.length > row && word[row] !== null
              ? word[row].charAt(item)
              : ''
          }`}
          name={`Input${item}`}
          id={`r${row}c${item}`}
          key={`r${row}c${item}random-key-${Math.floor(Math.random() * 1000)}`} // random key ensures that the latest default value shows up during rerenders
        />
      )
    })
    console.log('hello', nInputs)
    console.log(this.inputElements)
    console.log('RENDER INPUT CALLED -----------------')
    return nInputs
  }

  render() {
    const { wordLength, showAlert } = this.state
    console.log(
      'render called',
      this.highlightedChars[wordLength],
      this.rowCount,
      allFiveLetterWords[0],
      allSixLetterWords[0],
      allSevenLetterWords[0],
      this.secretWord
    )
    return (
      <div
        className="App"
        style={{
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexGrow: 1,
          position: 'fixed',
          width: '100%',
          height: '100%',
        }}>
        <h3>N WORDLE</h3>
        <div>
          Choose N
          <input
            onChange={this.onChangeSelection}
            defaultChecked
            type="radio"
            value="5"
            name="word-length"
            style={{
              margin: '10px',
            }}
          />
          5
          <input
            onChange={this.onChangeSelection}
            type="radio"
            value="6"
            name="word-length"
            style={{
              margin: '10px',
            }}
          />
          6
          <input
            onChange={this.onChangeSelection}
            type="radio"
            value="7"
            name="word-length"
            style={{
              margin: '10px',
            }}
          />
          7
        </div>
        <div
          className="row-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflowX: 'hidden',
            overflowY: 'auto',
            maxHeight: '65%',
          }}>
          {this.rowCount[wordLength].map((index) => {
            const rowColor = this.rowBackgroundColor[index]
            return (
              <div
                onFocusCapture={this.handleFocusViaCapturing}
                onMouseDownCapture={this.handleMouseDownViaCapturing}
                onClickCapture={this.handleClickViaCapturing}
                style={{
                  pointerEvents: 'none',
                  margin: '0 auto',
                  display: 'flex',
                  height: '50px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${rowColor}`,
                  padding: '5px',
                }}
                id="d1">
                {this.renderInput(index, this.colorRules)}
              </div>
            )
          })}
        </div>
        {showAlert ? (
          <div
            style={{
              fontWeight: 'bold',
              borderRadius: '10px',
              padding: '20px',
              backgroundColor: 'black',
              color: 'white',
              minWidth: '100px',
              position: 'fixed',
              left: '50%',
              top: '30%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transform: 'translate(-50%, 0)',
            }}>
            {this.alertText}
          </div>
        ) : null}
        <div
          style={{
            alignSelf: 'center',
            width: '100%',
            maxWidth: '500px',
          }}>
          <Keyboard
            disableCaretPositioning={false}
            onKeyReleased={this.onKeyReleased}
            onChange={this.onChange}
            style={{ height: '28px' }}
            theme="react-simple-keyboard simple-keyboard hg-theme-default hg-layout-default keyboard-default-theme-override"
            layout={{
              default: [
                'Q W E R T Y U I O P',
                'A S D F G H J K L',
                '{enter} Z X C V B N M {bksp}',
              ],
            }}
            buttonTheme={Object.keys(this.highlightedChars[wordLength])
              .filter((color) => {
                console.log(
                  'color is ',
                  color,
                  this.highlightedChars[wordLength]
                )
                if (
                  Object.keys(this.highlightedChars[wordLength][color])
                    .length === 0
                ) {
                  return false // skip
                }
                return true
              })
              .map((color) => {
                console.log('please help', color)
                const characterList = Object.keys(
                  this.highlightedChars[wordLength][color]
                )
                  .join(' ')
                  .trim()
                console.log('characterList', characterList)
                return {
                  class: this.colors[color],
                  buttons: `${characterList}`,
                }
              })}
            mergeDisplay="true"
            display={{
              '{bksp}': 'delete',
              '{enter}': 'enter',
            }}
          />
        </div>
      </div>
    )
  }
}
export default App
