import './App.css'
import React, { Component } from 'react'
import Keyboard from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'
import './keyboardTheme.css'

class App extends Component {
  constructor() {
    super()
    this.state = {
      keyboard_current: '',
      activeRow: { 5: 0, 6: 0, 7: 0 },
      wordLength: 5,
    }
    this.secretWord = { 5: 'PIOUS', 6: 'SMARTY', 7: 'BRISTLE' }
    this.inputElements = {}
    this.count = 0
    this.items = {
      5: [0, 1, 2, 3, 4],
      6: [0, 1, 2, 3, 4, 5],
      7: [0, 1, 2, 3, 4, 5, 6],
    }
    this.wordsSubmitted = { 5: [], 6: [], 7: [] }
    this.last_char = ''
    this.grey = '#C0CED5'
    this.green = '#20B2AA'
    this.yellow = '#F1C359'
    this.colorRules = {}
  }

  componentDidMount() {
    const { activeRow, wordLength } = this.state
    console.log('componentDidMount called')
    console.log(this.inputElements)
    this.inputElements[`r${activeRow[wordLength]}c${this.count}`].focus()
  }

  componentDidUpdate() {
    const { activeRow, wordLength } = this.state
    console.log('componentDidUpdate called', this.inputElements)
    this.inputElements[`r${activeRow[wordLength]}c${this.count}`].focus()
  }

  // This is for virtual keyboard events
  onKeyReleased = (button) => {
    const { wordLength, activeRow } = this.state
    console.log(
      'onKeyReleased called',
      button,
      this.inputElements[`r${activeRow[wordLength]}c${this.count}`].value
    )
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
      this.wordsSubmitted[wordLength].push(
        this.items[wordLength]
          .map(
            (item) =>
              this.inputElements[`r${activeRow[wordLength]}c${item}`].value
          )
          .join('')
      )
      this.processResult()
      const newActiveRow = { ...activeRow }
      newActiveRow[wordLength] += 1
      this.setState({ activeRow: newActiveRow })
      console.log('count after press', this.count)
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
    console.log('Entered onChangeInput')
    console.log(event.target.value)
    const { activeRow, wordLength } = this.state

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
    const { wordLength, activeRow } = this.state
    console.log('Entered handleKeyDown', event, this.count)
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
      console.log('activeRow is updated')
      this.count = 0
      this.wordsSubmitted[wordLength].push(
        this.items[wordLength]
          .map(
            (item) =>
              this.inputElements[`r${activeRow[wordLength]}c${item}`].value
          )
          .join('')
      )
      this.processResult()
      const newActiveRow = { ...activeRow }
      newActiveRow[wordLength] += 1
      this.setState({ activeRow: newActiveRow })
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
      if (
        this.inputElements[
          `r${activeRow[wordLength]}c${item}`
        ].value.toUpperCase() ===
        this.secretWord[wordLength].charAt(item).toUpperCase()
      ) {
        this.colorRules[`w${wordLength}r${activeRow[wordLength]}c${item}`] =
          this.green
      } else if (
        this.secretWord[wordLength].includes(
          this.inputElements[
            `r${activeRow[wordLength]}c${item}`
          ].value.toUpperCase()
        )
      ) {
        this.colorRules[`w${wordLength}r${activeRow[wordLength]}c${item}`] =
          this.yellow
      } else {
        this.colorRules[`w${wordLength}r${activeRow[wordLength]}c${item}`] =
          this.grey
      }
      console.log(this.colorRules)
    })
  }

  renderInput(row, colorRules) {
    const { activeRow, isDisabled, wordLength } = this.state
    console.log('renderInput called', isDisabled, colorRules)
    const a = this.items[wordLength].map((item) => {
      const word = this.wordsSubmitted[wordLength]
      console.log(
        word.length > row && word[row] !== null ? word[row].charAt(0) : ''
      )
      console.log('wordsSubmitted is ', this.wordsSubmitted)
      console.log('word is ', wordLength, word, word[row], row)
      return (
        <input
          disabled={activeRow[wordLength] !== row}
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
    console.log('hello', a)
    console.log(this.inputElements)
    console.log('RENDER INPUT CALLED -----------------')
    return a
  }

  render() {
    console.log('render called')
    return (
      <div className="App" style={{ margin: 'auto' }}>
        <h2>N WORDLE</h2>
        <hr />
        Choose N
        <div>
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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
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
              backgroundColor: '#79DC78',
              padding: '10px',
            }}
            id="d1">
            {this.renderInput(0, this.colorRules)}
          </div>
          <div
            style={{
              pointerEvents: 'none',
              margin: '0 auto',
              display: 'flex',
              height: '50px',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#BFEF88',
              padding: '10px',
            }}
            id="d2">
            {this.renderInput(1, this.colorRules)}
          </div>
          <div
            style={{
              pointerEvents: 'none',
              margin: '0 auto',
              display: 'flex',
              height: '50px',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFED7F',
              padding: '10px',
            }}
            id="d3">
            {this.renderInput(2, this.colorRules)}
          </div>
          <div
            style={{
              pointerEvents: 'none',
              margin: '0 auto',
              display: 'flex',
              height: '50px',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFBF7F',
              padding: '10px',
            }}
            id="d4">
            {this.renderInput(3, this.colorRules)}
          </div>
          <div
            style={{
              pointerEvents: 'none',
              margin: '0 auto',
              display: 'flex',
              height: '50px',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FF6666',
              padding: '10px',
            }}
            id="d5">
            {this.renderInput(4, this.colorRules)}
          </div>
          <div
            style={{
              pointerEvents: 'none',
              margin: '0 auto',
              display: 'flex',
              height: '50px',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#A80900',
              padding: '10px',
            }}
            id="d6">
            {this.renderInput(5, this.colorRules)}
          </div>
        </div>
        <br />
        <div style={{ margin: 'auto', maxWidth: '500px' }}>
          <Keyboard
            keyboardRef={(r) => {
              this.state.keyboard_current = r
            }}
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
            buttonTheme={[
              {
                class: 'button-default-theme-override',
                buttons: 'Q W E R T Y U I O P A S D F G H J K L Z X C V B N M',
              },
            ]}
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
