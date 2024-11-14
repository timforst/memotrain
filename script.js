let times = [];
let targets = [];
let letterPairs = [];
let goodBad = [];
let numGood = -1;
let numTotal = -1;
let timeAtStart;
let startTime;
let stopTime;
let timePerLP;
let numberOfPairs = 23;
let runningIndex = 0;
let helpActive = false;
let currentFirstLetter = 'Z'
let currentSecondLetter = 'Z'
const memoPairs = [];
const letters = ['A', 'B', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'];

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle("dark-mode");
    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

window.addEventListener("load", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
});

document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        if (numTotal >= 0 && numTotal < numberOfPairs) {
            good();
        }
    }
    if (event.code === 'Enter') {
        if (numTotal == -1 && !helpActive) {
            startTraining();
        }
    }
    if (event.code === 'KeyN') {
        if (numTotal >= 0 && numTotal < numberOfPairs) {
            bad();
        }
    }
    if (event.code === 'KeyK') {
        if (numTotal == numberOfPairs) {
            goBack();
        } else if (helpActive) {
            closeHelp();
        }
    }
    if (event.code === 'KeyH') {
        if (helpActive) {
            closeHelp();
        } else {
            help();
        }
    }
    if (event.code === 'KeyD') {
        toggleDarkMode();
    }
})

function goBack() {
    document.getElementById('results-page').style.display = 'none';
    document.getElementById('start-page').style.display = 'block';
    numTotal = -1;
}

function help() {
    document.getElementById('start-page').style.display = 'none';
    document.getElementById('help-page').style.display = 'block';
    helpActive = true;
}
    
function closeHelp() {
    document.getElementById('help-page').style.display = 'none';
    document.getElementById('start-page').style.display = 'block';
    helpActive = false;
}

function randIndex(list) {
    let index = Math.floor(Math.random()*list.length);
    return index;
}

function genRandomNumbers(numberOfPairs) {
    let targets = [];
    for (let i = 0; i < numberOfPairs; i++) {
        let firstNumber = randIndex(letters);
        let secondNumber = firstNumber;
        while (firstNumber == secondNumber) {
            secondNumber = randIndex(letters);
        }
        targets.push(firstNumber);
        targets.push(secondNumber);
    }
    return targets;
}


function startTraining() {
    targets = genRandomNumbers(numberOfPairs);
    runningIndex = 0;
    numGood = 0;
    numTotal = 0;
    goodBad = [];
    times = []
    document.getElementById('start-page').style.display = 'none';
    document.getElementById('training-page').style.display = 'block';
    currentFirstLetter = letters[targets[runningIndex]];
    currentSecondLetter = letters[targets[runningIndex+1]];
    letterPairs.push(currentFirstLetter+currentSecondLetter);
    document.getElementById("letter-pair").innerHTML = currentFirstLetter+currentSecondLetter;
    startTime = Date.now();
    timeAtStart = Date.now();

}

function updateResults() {
    document.getElementById("results-text").innerHTML = `${numGood} out of ${numTotal} letter pairs were good.`;
}

function updateResults() {
    document.getElementById("results-text").innerHTML = `${numGood}/${numTotal}`;
}

function updateTimePerLP() {
    document.getElementById("time-per-letter-pair").innerHTML = `${timePerLP} per Letter Pair`;
}

function incrementGood() {
    numGood++;
    numTotal++;
    updateResults();
}

function incrementBad() {
    numTotal++;
    updateResults();
}

function good() {
    endTime = Date.now();
    times.push(Math.round((endTime - startTime)/10) / 100);
    startTime = Date.now();
    runningIndex +=2;
    incrementGood();
    goodBad.push(true);
    if (runningIndex >= 2*numberOfPairs) {
        timePerLP = Math.round((endTime - timeAtStart) / 10 / numberOfPairs)/100;
        updateTimePerLP();
        showResults();
    } else {
        currentFirstLetter = letters[targets[runningIndex]];
        currentSecondLetter = letters[targets[runningIndex+1]];
        letterPairs.push(currentFirstLetter+currentSecondLetter);
        document.getElementById("letter-pair").innerHTML = currentFirstLetter+currentSecondLetter;
    }
}

function bad() {
    endTime = Date.now();
    times.push(Math.round((endTime - startTime)/10) / 100);
    startTime = Date.now();
    runningIndex +=2;
    incrementBad();
    goodBad.push(false);
    if (runningIndex >= 2*numberOfPairs) {
        timePerLP = Math.round((endTime - timeAtStart) / 10 / numberOfPairs)/100;
        updateTimePerLP();
        showResults();
    } else {
        currentFirstLetter = letters[targets[runningIndex]];
        currentSecondLetter = letters[targets[runningIndex+1]];
        letterPairs.push(currentFirstLetter+currentSecondLetter);
        document.getElementById("letter-pair").innerHTML = currentFirstLetter+currentSecondLetter;
    }
}


function showResults() {
    const combinedList = document.getElementById('results-list');
    combinedList.innerHTML = ''; 
    for (let i = 0; i < numberOfPairs; i++) {
        const li = document.createElement('li');
        const leftSpan = document.createElement('span');
        leftSpan.textContent = letterPairs[i];
        const rightSpan = document.createElement('span');
        rightSpan.textContent = times[i];
        if (goodBad[i]) {
            li.style.backgroundColor = '#77DD77';
        } else {
            li.style.backgroundColor = '#FF6666';
        }
        li.appendChild(leftSpan);
        li.appendChild(rightSpan);
        combinedList.appendChild(li);
    }
    document.getElementById('training-page').style.display = 'none';
    document.getElementById('results-page').style.display = 'block';
    
}
