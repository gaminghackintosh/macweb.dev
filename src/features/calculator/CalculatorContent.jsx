import React, { useState, useCallback, useEffect, memo, useContext } from "react";
import { WindowContext } from "@/windows"; // Убедись, что путь правильный

const CalculatorButton = memo(function CalculatorButton({ 
  label, 
  onClick, 
  className = "", 
  active = false,
  large = false
}) {
  return (
    <button
      className={`calc__btn ${className} ${active ? 'calc__btn--active' : ''} ${large ? 'calc__btn--large' : ''}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
});

export function CalculatorContent({ onClose, onMinimize }) {
  const { onTitleMouseDown } = useContext(WindowContext);
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState('');

  const inputDigit = useCallback((digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  }, [display, waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setHistory('');
  }, []);

  const toggleSign = useCallback(() => {
    setDisplay(String(-parseFloat(display)));
  }, [display]);

  const inputPercent = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  }, [display]);

  const performOperation = useCallback((nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
      setHistory(`${inputValue} ${nextOperation}`);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let result;

      switch (operation) {
        case '+': result = currentValue + inputValue; break;
        case '-': result = currentValue - inputValue; break;
        case '×': result = currentValue * inputValue; break;
        case '÷': result = currentValue / inputValue; break;
        default: result = inputValue;
      }

      setDisplay(String(result));
      setPreviousValue(result);
      setHistory(`${result} ${nextOperation}`);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  }, [display, previousValue, operation]);

  const calculate = useCallback(() => {
    if (!operation || previousValue === null) return;

    const inputValue = parseFloat(display);
    let result;

    switch (operation) {
      case '+': result = previousValue + inputValue; break;
      case '-': result = previousValue - inputValue; break;
      case '×': result = previousValue * inputValue; break;
      case '÷': result = previousValue / inputValue; break;
      default: result = inputValue;
    }

    setHistory(`${previousValue} ${operation} ${inputValue} =`);
    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  }, [display, previousValue, operation]);

  const backspace = useCallback(() => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }, [display]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const { key } = e;
      if (/\d/.test(key)) {
        e.preventDefault();
        inputDigit(parseInt(key, 10));
      } else if (key === '.') {
        e.preventDefault();
        inputDecimal();
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
      } else if (key === 'Escape') {
        e.preventDefault();
        clear();
      } else if (key === 'Backspace') {
        e.preventDefault();
        backspace();
      } else if (key === '+') {
        e.preventDefault();
        performOperation('+');
      } else if (key === '-') {
        e.preventDefault();
        performOperation('-');
      } else if (key === '*') {
        e.preventDefault();
        performOperation('×');
      } else if (key === '/') {
        e.preventDefault();
        performOperation('÷');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputDigit, inputDecimal, calculate, clear, backspace, performOperation]);

  const formattedDisplay = parseFloat(display).toLocaleString('en-US', {
    maximumFractionDigits: 10
  }) || display;

  return (
    <div className="calculator">
      <div 
        className="calculator__header" 
        onMouseDown={(e) => !e.target.closest('button') && onTitleMouseDown?.(e)}
      >
        <button className="traffic-light traffic-light--close" onClick={onClose} type="button" />
        <button className="traffic-light traffic-light--minimize" onClick={onMinimize} type="button" />
        {/* Кнопка Maximize отключена, как в настоящей macOS */}
        <button className="traffic-light traffic-light--disabled" disabled type="button" />
      </div>

      <div className="calculator__display">
        <div className="calculator__history">{history}</div>
        <div className="calculator__value">{formattedDisplay}</div>
      </div>

      <div className="calculator__buttons">
        <CalculatorButton label="AC" onClick={clear} className="calc__btn--function" />
        <CalculatorButton label="+/−" onClick={toggleSign} className="calc__btn--function" />
        <CalculatorButton label="%" onClick={inputPercent} className="calc__btn--function" />
        <CalculatorButton label="÷" onClick={() => performOperation('÷')} className="calc__btn--operator" active={operation === '÷'} />
        <CalculatorButton label="7" onClick={() => inputDigit(7)} />
        <CalculatorButton label="8" onClick={() => inputDigit(8)} />
        <CalculatorButton label="9" onClick={() => inputDigit(9)} />
        <CalculatorButton label="×" onClick={() => performOperation('×')} className="calc__btn--operator" active={operation === '×'} />
        <CalculatorButton label="4" onClick={() => inputDigit(4)} />
        <CalculatorButton label="5" onClick={() => inputDigit(5)} />
        <CalculatorButton label="6" onClick={() => inputDigit(6)} />
        <CalculatorButton label="−" onClick={() => performOperation('-')} className="calc__btn--operator" active={operation === '-'} />
        <CalculatorButton label="1" onClick={() => inputDigit(1)} />
        <CalculatorButton label="2" onClick={() => inputDigit(2)} />
        <CalculatorButton label="3" onClick={() => inputDigit(3)} />
        <CalculatorButton label="+" onClick={() => performOperation('+')} className="calc__btn--operator" active={operation === '+'} />
        <CalculatorButton label="0" onClick={() => inputDigit(0)} large />
        <CalculatorButton label="." onClick={inputDecimal} />
        <CalculatorButton label="=" onClick={calculate} className="calc__btn--operator" />
      </div>
    </div>
  );
}

export default CalculatorContent;