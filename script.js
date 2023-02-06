// UI elements
const display = document.querySelector("div[class=display]");
// Digits
const digitButtons = Array.from(document.querySelectorAll("button[class=digit]"));
// Decimal dot
const buttonDot = document.querySelector("button[id=dot]");
// Operations
const operationButtons = Array.from(document.querySelectorAll("button[class=operation]"));
// Controls
const buttonBack = document.querySelector("button[id=backspace]");
const buttonClear = document.querySelector("button[id=clear]");
const buttonEnter = document.querySelector("button[id=enter]");

// Global variables
const OPERATIONS = ["multiply", "divide", "add", "subtract", "exponentiate", "logarithm"];
const OPERATION_KEYS = ['*', '/', "+", "-", 'e', "l"];
const state = {
    "previousOperand": null,
    "currentOperand": null
}
let selectedOperation = null;
let newOperand = true;
let dotToggled = false;

// Resize elements upon initialization
resizeOps();

// Add listeners
// For window
window.addEventListener("resize", resizeOps);

// For controls
buttonClear.addEventListener("click", () => {
    actOnClear();
});

buttonBack.addEventListener("click", () => {
    actOnBack();
});

// For digit buttons
digitButtons.forEach((button) => button.addEventListener(
        "click",
        (e) => addNewDigit(e.target.textContent)
    )
);

// For keys
document.addEventListener("keydown", (e) => {
    switch(e.code) {
        case "Enter":
            actOnEnter();
            break;
        case "Delete":
        case "Backspace":
            actOnBack();
            break;
        case "KeyC":
            actOnClear();
            break;
        case "Period":
            actOnDot();
            break;
        case "Esc":
            break;
        default:
            const key = e.key.toLowerCase();
            if (key === Number(key).toString()) {
                addNewDigit(key);
            } else if (OPERATION_KEYS.includes(key)) {
                setOperation(OPERATIONS[OPERATION_KEYS.findIndex((el) => el === key)]);
            }
            break;
    }
}, false);

// For dot button
buttonDot.addEventListener("click", () => {
    actOnDot();
});

// For operation buttons
operationButtons.forEach((button) => button.addEventListener(
        "click",
        (e) => setOperation(e.target.id)
    )
);

buttonEnter.addEventListener("click", () => {
    actOnEnter();
});

// For digit

// Callbacks
// Add new digit
function addNewDigit(digit) {
    let value = getDisplayValue();
    if (value.length === 21) {
        return;
    }
    if (newOperand) {
        newOperand = false;
        value = ".";
    }
    if (value === "." || value === "OVERFLOW") {
        value = `${digit}.`;
    } else {
        if (value.slice(-1) === '.') {
            if (dotToggled) {
                value += digit;
            } else {
                if (value !== "0.") {
                    value = value.slice(0, -1) + `${digit}.`;    
                } else {
                    value = `${digit}.`;
                }
            }
        } else {
            value += digit;
        }
    }
    setDisplayValue(value);
}

// Set operation
function setOperation(newOperation) {
    if (state.previousOperand === null) {
        state.previousOperand = Number(getDisplayValue());
    } else if (state.currentOperand === null) {
        state.currentOperand = Number(getDisplayValue());
        executeOperation();
        setDisplayValue(state.previousOperand);
    } else {
        state.previousOperand = state.currentOperand;
        state.currentOperand = Number(getDisplayValue());
        executeOperation();
        setDisplayValue(state.previousOperand);
    }
    selectedOperation = newOperation;
    newOperand = true;
}

// Helper functions
// Resize element reference
function resizeOps() {
    document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
}

// Get display value
function getDisplayValue() {
    return display.textContent;
}

// Set display value
function setDisplayValue(newValue) {
    let value;
    if (typeof(newValue) !== "string") {
        value = newValue.toString();
    } else {
        value = newValue;
    }
    if (value.length > 21) {
        value = "OVERFLOW";
    }
    display.textContent = value.includes('.')? value : value + '.';
}

// Execute operation
function executeOperation() {
    if (state.previousOperand === null || state.currentOperand === null || !OPERATIONS.includes(selectedOperation)) {
        return;
    }

    switch(selectedOperation) {
        case "multiply":
            state.previousOperand *= state.currentOperand;
            break;
        case "divide":
            state.previousOperand /= state.currentOperand;
            break;
        case "add":
            state.previousOperand += state.currentOperand;
            break;
        case "subtract":
            state.previousOperand -= state.currentOperand;
            break;
        case "exponentiate":
            state.previousOperand = state.previousOperand ** state.currentOperand;
            break;
        case "logarithm":
            if (state.currentOperand === 2) {
                state.previousOperand = Math.log2(state.previousOperand);
            } else if (state.currentOperand === 10) {
                state.previousOperand = Math.log10(state.previousOperand);
            } else {
                state.previousOperand = Math.log(state.previousOperand) / Math.log(state.currentOperand);
            }
            break;
    }
    state.currentOperand = null;
}

function actOnClear() {
    state.previousOperand = null;
    state.currentOperand = null;
    selectedOperation = null;
    dotToggled = false;
    newOperand = true;
    display.textContent = ".";
}

function actOnBack() {
    let value = getDisplayValue();
    if (value !== "." && value !== "OVERFLOW") {
        if (value.slice(-1) === '.') {
            dotToggled = false;
            value = value.slice(0, -2) + '.';
        } else {
            value = value.slice(0, -1);
        }
    } else if (value === ".") {
        dotToggled = false;
    } else {
        value = ".";
    }
    setDisplayValue(value);
}

function actOnEnter() {
    if (state.previousOperand !== null || state.currentOperand !== null) {
        setOperation(null);
        setDisplayValue(state.previousOperand);
    }
    selectedOperation = null;
    dotToggled = false;
    newOperand = true;
}

function actOnDot() {
    let value = getDisplayValue();
    if (value === ".") {
        value = "0.";
        setDisplayValue(value);
    }
    dotToggled = true;
}
