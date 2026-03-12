document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            this.classList.add('active');
            const targetId = this.id.replace('-tab', '');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Unit Conversions
    const categorySelect = document.getElementById('category');
    const fromUnitSelect = document.getElementById('from-unit');
    const toUnitSelect = document.getElementById('to-unit');
    const convertBtn = document.getElementById('convert-btn');
    const resultDiv = document.getElementById('result');

    const units = {
        length: ['meters', 'feet', 'inches', 'centimeters', 'kilometers', 'miles'],
        weight: ['kilograms', 'pounds', 'ounces', 'grams'],
        temperature: ['celsius', 'fahrenheit', 'kelvin'],
        volume: ['liters', 'gallons', 'cups', 'milliliters', 'cubic meters']
    };

    function populateUnits() {
        const category = categorySelect.value;
        fromUnitSelect.innerHTML = '';
        toUnitSelect.innerHTML = '';
        units[category].forEach(unit => {
            fromUnitSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
            toUnitSelect.innerHTML += `<option value="${unit}">${unit}</option>`;
        });
    }

    categorySelect.addEventListener('change', populateUnits);
    populateUnits();

    convertBtn.addEventListener('click', function() {
        const value = parseFloat(document.getElementById('input-value').value);
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;
        const category = categorySelect.value;

        if (isNaN(value)) {
            resultDiv.textContent = 'Please enter a valid number';
            return;
        }

        let result;
        if (category === 'length') {
            result = convertLength(value, fromUnit, toUnit);
        } else if (category === 'weight') {
            result = convertWeight(value, fromUnit, toUnit);
        } else if (category === 'temperature') {
            result = convertTemperature(value, fromUnit, toUnit);
        } else if (category === 'volume') {
            result = convertVolume(value, fromUnit, toUnit);
        }

        resultDiv.textContent = `${value} ${fromUnit} = ${result.toFixed(2)} ${toUnit}`;
    });

    // Exam Countdown
    const examDateInput = document.getElementById('exam-date');
    const setCountdownBtn = document.getElementById('set-countdown');
    const countdownDisplay = document.getElementById('countdown-display');
    let countdownInterval;

    setCountdownBtn.addEventListener('click', function() {
        const examDate = new Date(examDateInput.value);
        if (isNaN(examDate.getTime())) {
            countdownDisplay.textContent = 'Please select a valid date and time';
            return;
        }

        clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            const now = new Date();
            const timeLeft = examDate - now;

            if (timeLeft <= 0) {
                countdownDisplay.textContent = 'Exam time!';
                clearInterval(countdownInterval);
                return;
            }

            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            countdownDisplay.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }, 1000);
    });

    // Study Timer (Pomodoro)
    const timerDisplay = document.getElementById('timer-display');
    const startTimerBtn = document.getElementById('start-timer');
    const pauseTimerBtn = document.getElementById('pause-timer');
    const resetTimerBtn = document.getElementById('reset-timer');
    let timerInterval;
    let timeLeft = 25 * 60; // 25 minutes in seconds
    let isWorkTime = true;

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    startTimerBtn.addEventListener('click', function() {
        if (timerInterval) return; // Already running
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                if (isWorkTime) {
                    alert('Work time over! Take a 5-minute break.');
                    timeLeft = 5 * 60;
                    isWorkTime = false;
                } else {
                    alert('Break time over! Back to work.');
                    timeLeft = 25 * 60;
                    isWorkTime = true;
                }
                updateTimerDisplay();
            }
        }, 1000);
    });

    pauseTimerBtn.addEventListener('click', function() {
        clearInterval(timerInterval);
        timerInterval = null;
    });

    resetTimerBtn.addEventListener('click', function() {
        clearInterval(timerInterval);
        timerInterval = null;
        timeLeft = 25 * 60;
        isWorkTime = true;
        updateTimerDisplay();
    });

    // GPA Calculator
    const addCourseBtn = document.getElementById('add-course');
    const calculateGpaBtn = document.getElementById('calculate-gpa');
    const gpaResultDiv = document.getElementById('gpa-result');
    const coursesDiv = document.getElementById('courses');

    addCourseBtn.addEventListener('click', function() {
        const courseDiv = document.createElement('div');
        courseDiv.className = 'course';
        courseDiv.innerHTML = `
            <input type="text" placeholder="Course Name" class="course-name">
            <input type="number" placeholder="Credits" class="credits" min="1">
            <select class="grade">
                <option value="4.0">A</option>
                <option value="3.7">A-</option>
                <option value="3.3">B+</option>
                <option value="3.0">B</option>
                <option value="2.7">B-</option>
                <option value="2.3">C+</option>
                <option value="2.0">C</option>
                <option value="1.7">C-</option>
                <option value="1.3">D+</option>
                <option value="1.0">D</option>
                <option value="0.0">F</option>
            </select>
        `;
        coursesDiv.appendChild(courseDiv);
    });

    calculateGpaBtn.addEventListener('click', function() {
        const courses = document.querySelectorAll('.course');
        let totalPoints = 0;
        let totalCredits = 0;

        courses.forEach(course => {
            const credits = parseFloat(course.querySelector('.credits').value);
            const grade = parseFloat(course.querySelector('.grade').value);

            if (!isNaN(credits) && !isNaN(grade)) {
                totalPoints += credits * grade;
                totalCredits += credits;
            }
        });

        if (totalCredits === 0) {
            gpaResultDiv.textContent = 'Please add courses with valid credits and grades';
            return;
        }

        const gpa = totalPoints / totalCredits;
        gpaResultDiv.textContent = `Your GPA: ${gpa.toFixed(2)}`;
    });

    // Quick Notes
    const notesTextarea = document.getElementById('notes');
    const saveNotesBtn = document.getElementById('save-notes');
    const savedNotesDiv = document.getElementById('saved-notes');

    saveNotesBtn.addEventListener('click', function() {
        const notes = notesTextarea.value;
        if (notes.trim()) {
            savedNotesDiv.textContent = notes;
            localStorage.setItem('studentNotes', notes);
        }
    });

    // Load saved notes on page load
    const savedNotes = localStorage.getItem('studentNotes');
    if (savedNotes) {
        notesTextarea.value = savedNotes;
        savedNotesDiv.textContent = savedNotes;
    }
});

// Conversion functions
function convertLength(value, from, to) {
    const conversions = {
        meters: 1,
        feet: 3.28084,
        inches: 39.3701,
        centimeters: 100,
        kilometers: 0.001,
        miles: 0.000621371
    };
    return value * conversions[to] / conversions[from];
}

function convertWeight(value, from, to) {
    const conversions = {
        kilograms: 1,
        pounds: 2.20462,
        ounces: 35.274,
        grams: 1000
    };
    return value * conversions[to] / conversions[from];
}

function convertTemperature(value, from, to) {
    if (from === to) return value;
    let celsius;
    if (from === 'celsius') celsius = value;
    else if (from === 'fahrenheit') celsius = (value - 32) * 5/9;
    else if (from === 'kelvin') celsius = value - 273.15;

    if (to === 'celsius') return celsius;
    else if (to === 'fahrenheit') return celsius * 9/5 + 32;
    else if (to === 'kelvin') return celsius + 273.15;
}

function convertVolume(value, from, to) {
    const conversions = {
        liters: 1,
        gallons: 0.264172,
        cups: 4.22675,
        milliliters: 1000,
        'cubic meters': 0.001
    };
    return value * conversions[to] / conversions[from];
}