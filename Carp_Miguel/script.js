class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.updateDisplay();
    }

    delete() {
        if (this.shouldResetScreen) return;
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }

        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
            case '*':
                computation = prev * current;
                break;
            case '÷':
            case '/':
                if (current === 0) {
                    computation = 'Error';
                } else {
                    computation = prev / current;
                }
                break;
            default:
                return;
        }

        if (computation !== 'Error') {
            // Rounding to avoid floating point precision issues
            computation = Math.round(computation * 100000000) / 100000000;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    percent() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString();
        this.updateDisplay();
    }

    toggleSign() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current) || current === 0) return;
        this.currentOperand = (current * -1).toString();
        this.updateDisplay();
    }

    formatDisplayNumber(number) {
        if (number === 'Error') return 'Error';
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('es', { maximumFractionDigits: 0 });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.formatDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.formatDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.getElementById('previous-operand');
    const currentOperandElement = document.getElementById('current-operand');
    const calculator = new Calculator(previousOperandElement, currentOperandElement);

    // Event listeners para números
    document.querySelectorAll('[data-number]').forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.dataset.number);
        });
    });

    // Event listeners para operadores
    document.querySelectorAll('[data-operator]').forEach(button => {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.dataset.operator);
        });
    });

    // Event listener para igual
    document.getElementById('btn-equals').addEventListener('click', () => {
        calculator.compute();
    });

    // Event listener para limpiar (AC)
    document.getElementById('btn-clear').addEventListener('click', () => {
        calculator.clear();
    });

    // Event listener para borrar (DEL)
    document.getElementById('btn-delete').addEventListener('click', () => {
        calculator.delete();
    });

    // Event listener para porcentaje (%)
    document.getElementById('btn-percent').addEventListener('click', () => {
        calculator.percent();
    });

    // Event listener para cambiar signo (±)
    document.getElementById('btn-toggle-sign').addEventListener('click', () => {
        calculator.toggleSign();
    });

    // Soporte para teclado físico
    window.addEventListener('keydown', (e) => {
        let key = e.key;

        if ((key >= '0' && key <= '9') || key === '.') {
            calculator.appendNumber(key);
            highlightButton(`[data-number="${key}"]`);
        } else if (key === '+' || key === '-') {
            calculator.chooseOperation(key);
            const id = key === '+' ? 'btn-add' : 'btn-subtract';
            highlightButton(`#${id}`);
        } else if (key === '*') {
            calculator.chooseOperation('×');
            highlightButton('#btn-multiply');
        } else if (key === '/') {
            e.preventDefault();
            calculator.chooseOperation('÷');
            highlightButton('#btn-divide');
        } else if (key === 'Enter' || key === '=') {
            e.preventDefault();
            calculator.compute();
            highlightButton('#btn-equals');
        } else if (key === 'Backspace') {
            calculator.delete();
            highlightButton('#btn-delete');
        } else if (key === 'Escape') {
            calculator.clear();
            highlightButton('#btn-clear');
        } else if (key === '%') {
            calculator.percent();
            highlightButton('#btn-percent');
        }
    });

    function highlightButton(selector) {
        const btn = document.querySelector(selector);
        if (btn) {
            btn.classList.add('active-key');
            setTimeout(() => btn.classList.remove('active-key'), 120);
        }
    }
});
