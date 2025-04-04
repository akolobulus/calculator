
     
const operationDisplay = document.querySelector('.operation');
const resultDisplay = document.querySelector('.result');

let currentValue = '0';
let expression = '';
let lastResult = null;
let lastOperator = null;
let lastOperand = null;

document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', handleButtonClick);
});

function handleButtonClick(e) {
  const { value } = e.target;
  switch (value) {
    case 'AC': resetCalculator(); break;
    case 'C': clearEntry(); break;
    case '%': handlePercent(); break;
    case '+': case '-': case '*': case '/': handleOperator(value); break;
    case '=': handleEquals(); break;
    case '.': handleDecimal(); break;
    default: handleNumber(value); break;
  }
}

function handleNumber(num) {
  if (currentValue === '0' || currentValue === 'Error') {
    currentValue = num;
  } else {
    currentValue += num;
  }
  updateDisplay();
}

function handleDecimal() {
  if (!currentValue.includes('.')) {
    currentValue += '.';
    updateDisplay();
  }
}

function handleOperator(nextOperator) {
  if (currentValue === 'Error') return;
  
  // Validate currentValue before adding to expression
  if (currentValue === '.' || isNaN(currentValue)) {
    currentValue = '0';
  }

  if (currentValue !== '0' || currentValue.includes('.')) {
    expression += currentValue;
    currentValue = '0';
  }

  const lastChar = expression.slice(-1);
  if ('+-*/'.includes(lastChar)) {
    expression = expression.slice(0, -1) + nextOperator;
  } else {
    expression += nextOperator;
  }

  operationDisplay.textContent = expression;
  updateDisplay();
}

function handleEquals() {
  if (expression === '' && lastOperator !== null) {
    // Repeat last operation
    const currentNum = parseFloat(currentValue);
    const result = calculate(lastResult, currentNum, lastOperator);
    currentValue = result.toString();
    lastResult = result;
    operationDisplay.textContent = `${lastResult} ${lastOperator} ${currentNum} =`;
    updateDisplay();
    return;
  }

  if (expression === '') return;

  expression += currentValue;
  let result;
  try {
    result = eval(expression.replace(/×/g, '*').replace(/÷/g, '/'));
    if (result === Infinity || isNaN(result)) result = 'Error';
  } catch (e) {
    result = 'Error';
  }

  // Store last operator and operand
  const operators = ['+', '-', '*', '/'];
  let opIndex = -1;
  for (let i = expression.length - 1; i >= 0; i--) {
    if (operators.includes(expression[i])) {
      opIndex = i;
      break;
    }
  }

  if (opIndex !== -1 && result !== 'Error') {
    lastOperator = expression[opIndex];
    lastOperand = parseFloat(expression.substring(opIndex + 1));
    lastResult = result;
  }

  operationDisplay.textContent = expression + ' =';
  currentValue = result.toString();
  expression = '';
  updateDisplay();
}

function handlePercent() {
  const num = parseFloat(currentValue);
  currentValue = (num / 100).toString();
  updateDisplay();
}

function clearEntry() {
  currentValue = '0';
  updateDisplay();
}

function resetCalculator() {
  currentValue = '0';
  expression = '';
  lastResult = lastOperator = lastOperand = null;
  operationDisplay.textContent = '';
  updateDisplay();
}

function calculate(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b !== 0 ? a / b : 'Error';
    default: return 'Error';
  }
}

function updateDisplay() {
  if (currentValue === 'Error') {
    resultDisplay.textContent = 'Error';
    return;
  }
  resultDisplay.textContent = currentValue.length > 10 
    ? parseFloat(currentValue).toExponential(5) 
    : currentValue;
}
 // ... (Previous JavaScript code with critical improvements below) ...

    // ========== SAFE EXPRESSION PARSER ========== //
    const operatorPrecedence = {'+':1, '-':1, '*':2, '/':2};

    function parseExpression(expr) {
      expr = expr.replace(/×/g, '*').replace(/÷/g, '/');
      const tokens = expr.match(/(\d+\.?\d*)|([+\-*/])/g) || [];
      const output = [];
      const operators = [];

      tokens.forEach(token => {
        if (!isNaN(token)) {
          output.push(parseFloat(token));
        } else {
          while (operators.length > 0 && 
                 operatorPrecedence[operators[operators.length-1]] >= operatorPrecedence[token]) {
            output.push(operators.pop());
          }
          operators.push(token);
        }
      });

      return [...output, ...operators.reverse()];
    }

    function evaluatePostfix(postfix) {
      const stack = [];
      postfix.forEach(token => {
        if (typeof token === 'number') {
          stack.push(token);
        } else {
          const b = stack.pop();
          const a = stack.pop();
          switch(token) {
            case '+': stack.push(a + b); break;
            case '-': stack.push(a - b); break;
            case '*': stack.push(a * b); break;
            case '/': stack.push(b !== 0 ? a / b : 'Error'); break;
          }
        }
      });
      return stack[0];
    }

    // ========== MODIFIED handleEquals FUNCTION ========== //
    function handleEquals() {
      if (expression === '' && lastOperator !== null) {
        // Repeat last operation safely
        const currentNum = parseFloat(currentValue);
        const result = calculate(lastResult, currentNum, lastOperator);
        currentValue = result.toString();
        lastResult = result;
        operationDisplay.textContent = `${lastResult} ${lastOperator} ${currentNum} =`;
        updateDisplay();
        return;
      }

      if (expression === '') return;

      expression += currentValue;
      let result;
      try {
        const postfix = parseExpression(expression);
        result = evaluatePostfix(postfix);
        if (result === Infinity || isNaN(result)) result = 'Error';
      } catch {
        result = 'Error';
      }

      // ... (Rest of handleEquals logic remains unchanged) ...
    }

    // ========== ENHANCED INPUT VALIDATION ========== //
    function handleDecimal() {
      if (!/\./.test(currentValue.split(/[+\-*/]/).pop())) {
        currentValue += '.';
        updateDisplay();
      }
    }

    function handleNumber(num) {
      if (currentValue === '0' || currentValue === 'Error') {
        currentValue = num;
      } else {
        currentValue += num;
      }
      // Prevent multiple leading zeros
      if (currentValue.replace(/^0+/, '').startsWith('00')) {
        currentValue = currentValue.slice(0, -1);
      }
      updateDisplay();
    }