import './App.css';
import React from 'react';

const nonZeroRegex = /[1-9]+/;
// Variable used in concatExpression to track if a zero can be added to the expression
let zeroStatus = false;

class JavascriptCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expression: '',
      total: 0
    }
    this.concatExpression = this.concatExpression.bind(this);
    this.clearDisplay = this.clearDisplay.bind(this);
    this.calculateTotal = this.calculateTotal.bind(this);
  }

  componentDidUpdate() {
    let displayOverflow = document.getElementById('display');
    displayOverflow.scrollLeft = 999999;
  }
  
  concatExpression(numOrOperator) {
    let slicedExpression = '';
    
    this.setState((state) => {
      if (state.expression === 'Invalid expression') {
        return {
          expression: `${numOrOperator}`
        }
      }
      else if (typeof numOrOperator === 'number' || numOrOperator === '.') {
        if (numOrOperator === 0) {
          // Checking conditions of the current expression to see if the 0 can be added
          if (state.expression[state.expression.length - 1] === '0') {
            if (nonZeroRegex.test(state.expression[state.expression.length - 2]) === false) {
              if (zeroStatus === false) {
                return;
              }
            }
            else {
              // Setting zeroStatus to true to indicate that later 0's can be added
              zeroStatus = true;
              return {
                expression: state.expression + numOrOperator
              }
            }
          }
          else if (state.expression[state.expression.length - 1] === undefined || state.expression.length === 0) { 
            return {
              expression: '0'
            }
          }
          zeroStatus = true;
          return {
            expression: state.expression + numOrOperator
          }
        }
        else if (numOrOperator === '.') {
          // Preventing repeated decimals
          if (
            state.expression[state.expression.length - 1] === '.'
            || state.expression[state.expression.length - 2] === '.'
          ) {
            return;
          }
          else if (state.expression.length === 0) {
            return {
              expression: '0.'
            }
          }
        }
        else if (state.expression[state.expression.length - 1] === '0' && state.expression.length === 1) {
          return {
            expression: `${numOrOperator}`
          }
        }
        return {
          expression: state.expression + numOrOperator
        }
      }
      // Handling all operators
      else {
        zeroStatus = false;
        if (
          numOrOperator === '/'
          || numOrOperator === '*'
          || numOrOperator === '+'
        ) {
          if (
            state.expression[state.expression.length - 2] === '/'
            || state.expression[state.expression.length - 2] === '*'
            || state.expression[state.expression.length - 2] === '+'
          ) {
            // Handling repeated operators by replacing the previous one
              slicedExpression = state.expression.slice(0, state.expression.length - 2);
              return {
                expression: slicedExpression + numOrOperator + ' '
              }
          }
          else if (state.expression[state.expression.length - 1] === '/'
                  || state.expression[state.expression.length - 1] === '*'
                  || state.expression[state.expression.length - 1] === '+'
          ) {
              slicedExpression = state.expression.slice(0, state.expression.length - 1);
              return {
                expression: slicedExpression + numOrOperator + ' '
              }
            }
          else if (state.expression[state.expression.length - 2] === '-') {
            if (
              state.expression[state.expression.length - 4] === '/'
              || state.expression[state.expression.length - 4] === '*'
              || state.expression[state.expression.length - 4] === '+'
            ) {
              // Handling repeated operators by replacing the operator before the '-'
              slicedExpression = state.expression.slice(0, state.expression.length - 4);
              return {
                expression: slicedExpression + numOrOperator + ' '
              }
            }
          }
        }
        else if (numOrOperator === '-') {
          // Preventing multiple '-'
          if (state.expression[state.expression.length - 2] === '-') {
            return;
          }
          return {
            expression: state.expression + numOrOperator + ' '
          }
        }
        return {
          expression: state.expression === '' ? state.expression + numOrOperator
          : state.expression + ' ' + numOrOperator + ' '
        }
      }
    });
  }
  
  clearDisplay() {
    this.setState(() => {
      return {
        expression: '',
        total: 0
      }
    });
  }
  
  calculateTotal() {
    const numRegex = /[0-9]+/;

    this.setState((state) => {
      if (state.expression === '+'
          || state.expression === '-'
          || state.expression === '/'
          || state.expression === '*'
          || nonZeroRegex.test(state.expression) === false
          || numRegex.test(state.expression[state.expression.length - 1]) === false
      ) {
        return {
          expression: 'Invalid',
          total: 0
        }
      }
      else {
        return {
          expression: `${Function('return ' + state.expression)()}`,
          total: Function('return ' + state.expression)()
        }
      }
    });
  }
  
  render() {
    return (
      <div>
        <div className="container-fluid">
          <div className="row justify-content-end align-items-center" id="display-row">
            <div className="col-12 no-pad d-flex justify-content-end align-items-center" id="display">
              <span id='display-text'>{this.state.expression === '' ? this.state.total : this.state.expression}</span>
            </div>
          </div>
          <div className="row px border-bottom-black">
            <div className="col-9 no-pad border-right-black">
              <div className='btn-container'>
                <button className="btn btn-danger" id="clear" onClick={this.clearDisplay}>AC</button>
              </div>
            </div>
            <div className="col-3 no-pad">
              <div className='btn-container'>
                <button className="btn btn-secondary" id="divide" onClick={() => this.concatExpression('/')}>/</button>
              </div>
            </div>
          </div>
          <div className="row px border-bottom-black">
            <div className="col-3 no-pad border-right-black">
              <div className='btn-container'>
              <button className="btn btn-dark" id="seven" onClick={() => this.concatExpression(7)}>7</button>
              </div>
              {/* <button className="btn btn-dark" id="seven" onClick={() => this.concatExpression(7)}>7</button> */}
            </div>
            <div className="col-3 no-pad border-right-black">
              <div className='btn-container'>
              <button className="btn btn-dark" id="eight" onClick={() => this.concatExpression(8)}>8</button>
              </div>
              {/* <button className="btn btn-dark" id="eight" onClick={() => this.concatExpression(8)}>8</button> */}
            </div>
            <div className="col-3 no-pad border-right-black">
              <div className='btn-container'>
              <button className="btn btn-dark" id="nine" onClick={() => this.concatExpression(9)}>9</button>
              </div>
              {/* <button className="btn btn-dark" id="nine" onClick={() => this.concatExpression(9)}>9</button> */}
            </div>
            <div className="col-3 no-pad">
              <div className='btn-container'>
              <button className="btn btn-secondary" id="multiply" onClick={() => this.concatExpression('*')}>x</button>
              </div>
            </div>
          </div>
          <div className="row px border-bottom-black">
            <div className="col-3 no-pad border-right-black">
              <div className='btn-container'>
              <button className="btn btn-dark" id="four" onClick={() => this.concatExpression(4)}>4</button>
              </div>
            </div>
            <div className="col-3 no-pad border-right-black">
              <div className='btn-container'>
              <button className="btn btn-dark" id="five" onClick={() => this.concatExpression(5)}>5</button>
              </div>
            </div>
            <div className="col-3 no-pad border-right-black">
              <div className='btn-container'>
              <button className="btn btn-dark" id="six" onClick={() => this.concatExpression(6)}>6</button>
              </div>
            </div>
            <div className="col-3 no-pad">
              <div className='btn-container'>
              <button className="btn btn-secondary" id="subtract" onClick={() => this.concatExpression('-')}>-</button>
              </div>
            </div>
          </div>
          <div className="row px border-bottom-black">
            <div className="col-3 no-pad border-right-black">
              <div className='btn-container'>
                <button className="btn btn-dark" id="one" onClick={() => this.concatExpression(1)}>1</button>
              </div>
            </div>
            <div className="col-3 no-pad border-right-black">
              <div className='btn-container'>
                <button className="btn btn-dark" id="two" onClick={() => this.concatExpression(2)}>2</button>
              </div>
            </div>
            <div className="col-3 no-pad border-right-black">
              <div className='btn-container'>
                <button className="btn btn-dark" id="three" onClick={() => this.concatExpression(3)}>3</button>
              </div>
            </div>
            <div className="col-3 no-pad">
              <div className='btn-container'>
                <button className="btn btn-secondary" id="add" onClick={() => this.concatExpression('+')}>+</button>
              </div>
            </div>
          </div>
          <div className="row p-notop">
            <div className="col-6 no-pad border-right-black">
              <div className='btn-container'>
                <button className="btn btn-dark" id="zero" onClick={() => this.concatExpression(0)}>0</button>
              </div>
            </div>
            <div className="col-3 no-pad border-right-black">
              <div className='btn-container'>
                <button className="btn btn-dark" id="decimal" onClick={() => this.concatExpression('.')}>.</button>
              </div>
            </div>
            <div className="col-3 no-pad">
              <div className='btn-container'>
                <button className="btn btn-primary" id="equals" onClick={this.calculateTotal}>=</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default JavascriptCalculator;