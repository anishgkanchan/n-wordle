import './App.css'
import React, { Component } from 'react'
import Keyboard from 'react-simple-keyboard'
import 'react-simple-keyboard/build/css/index.css'

class App extends Component {
  constructor() {
    super()
    this.state = {
      keyboard_current: '',
      activeRow: 0,
    }
    this.secretWord = 'PIOUS'
    this.inputElements = {}
    this.count = 0
    this.items = [0, 1, 2, 3, 4]
    this.last_char = ''
    this.grey = '#C0CED5'
    this.green = '#20B2AA'
    this.yellow = '#F1C359'
    //this.white = '#FFFFFF'
    this.colorRules = {}
  }

  componentDidMount() {
    console.log('componentDidMount called')
    console.log(this.inputElements)
    this.inputElements[this.count].focus()
  }

  componentDidUpdate() {
    console.log('componentDidUpdate called', this.inputElements)
    this.inputElements[this.count].focus()
  }

  //This is for virtual keyboard events
  onKeyReleased = (button) => {
    console.log(
      'onKeyReleased called',
      button,
      this.inputElements[this.count].value
    )
    if (button === '{bksp}') {
      console.log('bksp is pressed')
      if (this.inputElements[this.count].value == '' && this.count > 0) {
        this.count -= 1
      }
      this.inputElements[this.count].focus()
      this.inputElements[this.count].value = ''
    } else if (
      button == '{enter}' &&
      this.count === 4 &&
      this.inputElements[this.count].value != ''
    ) {
      console.log('Button pressed', button, this.count)
      console.log(this.inputElements[this.count])
      this.count = 0
      this.processResult()
      this.setState((prevState) => {
        return { activeRow: prevState.activeRow + 1 }
      })
      console.log('count after press', this.count)
    } else if (
      (button.charCodeAt(0) >= 'a'.charCodeAt(0) &&
        button.charCodeAt(0) <= 'z'.charCodeAt(0)) ||
      (button.charCodeAt(0) >= 'A'.charCodeAt(0) &&
        button.charCodeAt(0) <= 'Z'.charCodeAt(0))
    ) {
      console.log('hello 1')
      this.inputElements[this.count].value = button
      if (this.count < 4) {
        this.count += 1
      }

      this.inputElements[this.count].focus()
    } else {
      this.inputElements[this.count].focus()
    }
  }

  //This is for physical keyboard events only letters
  onChangeInput = (event) => {
    console.log('Entered onChangeInput')
    console.log(event.target.value)

    if (event.target.value != '') {
      if (this.count < 4) this.count += 1
      this.inputElements[this.count].focus()
    } else {
      if (this.last_char === '' && this.count > 0) {
        this.count -= 1
      }
      this.inputElements[this.count].focus()
    }
    this.last_char = event.target.value
  }

  //This is for physical keyboard events for enter/bksp/invalid letters
  handleKeyDown = (event) => {
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
      this.inputElements[this.count].focus()
      this.inputElements[this.count].value = ''
    } else if (
      event.key === 'Enter' &&
      this.count === 4 &&
      this.inputElements[this.count].value != ''
    ) {
      console.log('activeRow is updated')
      this.count = 0
      this.processResult()
      this.setState((prevState) => {
        return { activeRow: prevState.activeRow + 1 }
      })
    }
  }
  handleFocusViaCapturing = (event) => {
    console.log('focus occurred on div', event)
    event.stopPropagation()
    return false
  }
  handleMouseDownViaCapturing = (event) => {
    console.log('mouse down occurred on div', event)
    event.stopPropagation()
    return false
  }
  handleClickViaCapturing = (event) => {
    console.log('click occurred on div', event)
    event.stopPropagation()
    return false
  }

  handleClick = (event) => {
    console.log('click occurred on input!', event)
  }
  handleMouseDown = (event) => {
    console.log('mouse down occurred on input!', event)
  }
  handleFocus = (event) => {
    console.log('focus occurred!', event)
  }

  handleBlur = (event) => {
    console.log('blur occurred!', event)
    this.inputElements[this.count].focus()
  }

  onChange = (event) => {
    console.log('onChange occurred!', this.count)
    this.inputElements[this.count].focus()
  }

  processResult() {
    console.log('reached here', this.state.activeRow)
    this.items.forEach((item) => {
      console.log('checking for ', this.inputElements[item].value)
      if (
        this.inputElements[item].value.toUpperCase() ===
        this.secretWord.charAt(item).toUpperCase()
      ) {
        this.colorRules['r' + this.state.activeRow + 'c' + item] = this.green
      } else if (
        this.secretWord.includes(this.inputElements[item].value.toUpperCase())
      ) {
        this.colorRules['r' + this.state.activeRow + 'c' + item] = this.yellow
      } else {
        this.colorRules['r' + this.state.activeRow + 'c' + item] = this.grey
      }
      console.log(this.colorRules)
    })
  }

  renderInput(row, colorRules) {
    console.log('renderInput called', this.state.isDisabled, colorRules)
    const a = this.items.map((item) => (
      <input
        disabled={this.state.activeRow != row}
        ref={(input) => {
          if (this.state.activeRow === row) {
            this.inputElements[item] = input
          }
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
          fontSize: '20px',
          caretColor: 'transparent',
          cursor: 'default',
          textTransform: 'uppercase',
          textAlign: 'center',
          width: '30px',
          height: '30px',
          backgroundColor: `${
            colorRules != null &&
            colorRules.hasOwnProperty('r' + row + 'c' + item)
              ? colorRules['r' + row + 'c' + item]
              : 'white'
          }`,
          color: `${this.state.activeRow != row ? 'white' : 'black'}`,
          fontWeight: 'bold',
          margin: '2px',
          padding: '5px',
        }}
        name={'Input' + item}
        id={'r' + row + 'c' + item}
        key={'r' + row + 'c' + item}
      />
    ))
    console.log('hello', a)
    console.log(this.inputElements)
    return a
  }

  render() {
    console.log('render called')
    return (
      <div className="App" style={{ margin: 'auto', width: '40%' }}>
        <h1>NOT WORDLE</h1>
        <hr />
        <br />
        <br />
        <div
          onFocusCapture={this.handleFocusViaCapturing}
          onMouseDownCapture={this.handleMouseDownViaCapturing}
          onClickCapture={this.handleClickViaCapturing}
          style={{
            pointerEvents: 'none',
            margin: '0 auto',
            display: 'flex',
            width: '300px',
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
            margin: '0 auto',
            width: '300px',
            height: '50px',
            backgroundColor: '#BFEF88',
            padding: '10px',
          }}
          id="d2">
          {this.renderInput(1, this.colorRules)}
        </div>
        <div
          style={{
            margin: '0 auto',
            width: '300px',
            height: '50px',
            backgroundColor: '#FFED7F',
            padding: '10px',
          }}
          id="d3">
          {this.renderInput(2, this.colorRules)}
        </div>
        <div
          style={{
            margin: '0 auto',
            width: '300px',
            height: '50px',
            backgroundColor: '#FFBF7F',
            padding: '10px',
          }}
          id="d4">
          {this.renderInput(3, this.colorRules)}
        </div>
        <div
          style={{
            margin: '0 auto',
            width: '300px',
            height: '50px',
            backgroundColor: '#FF6666',
            padding: '10px',
          }}
          id="d5">
          {this.renderInput(4, this.colorRules)}
        </div>
        <br />
        <br />
        <br />
        <br />
        <Keyboard
          style={{ margin: '20px', width: '50%' }}
          keyboardRef={(r) => (this.state.keyboard_current = r)}
          disableCaretPositioning={false}
          onKeyReleased={this.onKeyReleased}
          onChange={this.onChange}
          layout={{
            default: [
              'q u e r t y u i o p',
              'a s d f g h j k l',
              '{enter} z x c v b n m {bksp}',
            ],
          }}
        />
      </div>
    )
  }
}
export default App
