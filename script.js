document.addEventListener('DOMContentLoaded', () => {
    // --- Get DOM Elements ---
    const display = document.querySelector('#display');
    const buttons = document.querySelector('.buttons');
    const themeToggler = document.querySelector('.theme-toggler');
    const soundSelector = document.querySelector('#sound-theme-selector');

    // --- Sound Pack Library ---
    const soundPacks = {
        mechanical: new Audio('sounds/mechanical.mp3'),
        bubble: new Audio('sounds/bubblepop.mp3') 
    };

    // Variable to hold the current sound theme.
    let currentSoundTheme = soundSelector.value;

    // --- Simpler playSound Function ---
    const playSound = () => {
        if (currentSoundTheme === 'none' || !soundPacks[currentSoundTheme]) {
            return;
        }

        const sound = soundPacks[currentSoundTheme];
        sound.currentTime = 0;
        sound.play().catch(error => console.error("Error playing sound:", error));
    };

    // --- Calculator Functions ---
    const clearDisplay = () => {
        display.textContent = '';
        playSound();
    };
    const deleteLastChar = () => {
        display.textContent = display.textContent.slice(0, -1);
        playSound();
    };
    const appendToDisplay = (value) => {
        display.textContent += value;
        playSound();
    };
    const calculateResult = () => {
        if (display.textContent) {
            playSound();
        }
        try {
            const result = safeCalculate(display.textContent);
            display.textContent = parseFloat(result.toFixed(10));
        } catch {
            display.textContent = 'Error';
        }
    };

    // --- Safer Calculation Function ---
    function safeCalculate(expression) {
        if (!expression) return ''; 
        if (/[^0-9+\-*/.%()]/.test(expression)) {
            throw new Error('Invalid characters in expression');
        }
        return new Function('return ' + expression)();
    }

    // --- Event Listener for Button Clicks ---
    buttons.addEventListener('click', (e) => {
        if (!e.target.matches('button')) return;

        const button = e.target;
        const value = button.dataset.value;

        if (value) {
            appendToDisplay(value);
        } else if (button.id === 'clear') {
            clearDisplay();
        } else if (button.id === 'delete') {
            deleteLastChar();
        } else if (button.id === 'equal') {
            calculateResult();
        }
    });

    // --- Event Listener for Keyboard Input ---
    document.addEventListener('keydown', (e) => {
        const key = e.key;

        if ((key >= '0' && key <= '9') || key === '.' || ['+', '-', '*', '/', '%'].includes(key)) {
            appendToDisplay(key);
        } else if (key === 'Enter' || key === '=') {
            e.preventDefault();
            calculateResult();
        } else if (key === 'Backspace') {
            deleteLastChar();
        } else if (key === 'Escape') {
            clearDisplay();
        }
    });

    // --- Event Listener for Sound Theme Change ---
    soundSelector.addEventListener('change', () => {
        currentSoundTheme = soundSelector.value;
        playSound();
    });

    // --- Theme Toggler Logic ---
    themeToggler.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
});


