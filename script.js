let times = [];
let letterPairs = [];
let resultsList = [];
let goodBad = [];
let numGood = -1;
let numTotal = -1;
let timeAtStart;
let startTime;
let stopTime;
let timePerLP;
let numberOfPairs = 10;
let runningIndex = 0;
let currentFirstLetter = 'Z'
let currentSecondLetter = 'Z'
const memoPairs = [];
const letters = ['A', 'B', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'];

document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        if (numTotal >= 0 && numTotal < numberOfPairs) {
            good();
        } else if (numTotal == -1) {
            startTraining();
        }
    }
    if (event.code === 'KeyN') {
        if (numTotal >= 0 && numTotal < numberOfPairs) {
            bad();
        } else if (numTotal == numberOfPairs) {
        document.getElementById('results-page').style.display = 'none';
            startTraining();
        }
    }
})

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

let targets = genRandomNumbers(numberOfPairs);

function startTraining() {
    runningIndex=0;
    numGood=0;
    numTotal=0
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
