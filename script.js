let times = [];
let targets = [];
let letterPairs = [];
let goodBad = [];
let numGood = -1;
let numTotal = -1;
let timeOut = 5;
let timeAtStart;
let startTime;
let stopTime;
let timePerLP;
let numberOfPairs = 23;
let runningIndex = 0;
let helpActive = false;
let settingsActive = false;
let statsActive = false;
let pauseActive = false;
let memoPActive = false;
let statsFromSettings = false;
let statsFromResults = false;
let currentFirstLetter = 'Z'
let currentSecondLetter = 'Z'
const memoPairs = [];
let statsPerLP = [];
let statsDates = [];
let statsAccuracy = [];
let uniqueLPList = [];
const letters = ['A', 'B', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'];

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('statsPerLP')) {
        statsPerLP = JSON.parse(localStorage.getItem('statsPerLP'));
        statsDates = JSON.parse(localStorage.getItem('statsDates'));
        statsAccuracy = JSON.parse(localStorage.getItem('statsAccuracy'));
    }
    if (localStorage.getItem('uniqueLPList')) {
        uniqueLPList = JSON.parse(localStorage.getItem('uniqueLPList'));
        document.getElementById("reset-button").textContent = uniqueLPList.length+'/506';
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const storedData = localStorage.getItem('csvData');
    if (storedData) {
        memoP = JSON.parse(storedData);
        document.getElementById('remove-memop-button').style.display = 'block';
        document.getElementById('upload-button').style.display = 'none';
        document.getElementById('file-button').style.display = 'none';
        memoPActive = true;
    }
});

document.getElementById('fileInput').addEventListener('change', function() {
    const fileInput = document.getElementById('fileInput');
    const customFileButton = document.getElementById('file-button');

    if (fileInput.files.length > 0) {
        customFileButton.textContent = fileInput.files[0].name;
        customFileButton.style.backgroundColor = '#28A745';  // Change color to indicate success
    } else {
        customFileButton.textContent = 'Choose File';  // Reset text if no file is selected
        customFileButton.style.backgroundColor = '#007BFF'; // Reset color
    }
});

window.addEventListener("load", () => {
  const userPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  if (userPrefersDark) {
    document.body.classList.add("dark-mode");
    toggleDarkMode();
    toggleDarkMode();
    toggleTimeOut();
    toggleTimeOut();
    toggleTimeOut();
    toggleTimeOut();
  } else {
    document.body.classList.remove("dark-mode");
    toggleDarkMode();
    toggleDarkMode();
    toggleTimeOut();
    toggleTimeOut();
    toggleTimeOut();
    toggleTimeOut();
  }

  // Save the preference if user toggles it
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
});

document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        if (numTotal >= 0 && numTotal < numberOfPairs && !pauseActive) {
            good();
        } else if (pauseActive) {
            resume();
        }
    }
    if (event.code === 'Enter') {
        if (numTotal == -1 && !helpActive && !settingsActive) {
            startTraining();
        }
    }
    if (event.code === 'KeyN') {
        if (numTotal >= 0 && numTotal < numberOfPairs && !pauseActive) {
            bad();
        }
    }
    if (event.code === 'KeyK') {
        goBack();
    }
    if (event.code === 'KeyH') {
        if (helpActive) {
            closeHelp();
        } else {
            help();
        }
    }
    if (event.code === 'KeyS') {
        if (settingsActive) {
            closeSettings();
        } else {
            settings();
        }
    }
    if (event.code === 'KeyT') {
        if (settingsActive) {
            toggleTimeOut();
        }
    }
    if (event.code === 'KeyO') {
        if (statsActive) {
            closeStats();
        } else if (settingsActive) {
            showStats("settings");
        } else if ( numTotal == numberOfPairs) {
            showStats("results");
        }
    }
    if (event.code === 'KeyD') {
        toggleDarkMode();
    }
})

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle("dark-mode");
    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        document.getElementById("darkmode-button").textContent = `Black`;
    } else {
        localStorage.setItem("theme", "light");
        document.getElementById("darkmode-button").textContent = `Dark`;
    }
}

function resetUniqueLPList() {
    uniqueLPList = createUniqueLP();
    document.getElementById("reset-button").textContent = uniqueLPList.length+'/506';
    localStorage.setItem('uniqueLPList', JSON.stringify(uniqueLPList));
}

function toggleTimeOut() {
    if (timeOut == 0) {
        timeOut = 3;
        document.getElementById("timeout-button").textContent = `3`;
    } else if (timeOut == 3 ) {
        timeOut = 5;
        document.getElementById("timeout-button").textContent = `5`;
    } else if (timeOut == 5 ) {
        timeOut = 10;
        document.getElementById("timeout-button").textContent = `10`;
    } else if (timeOut == 10 ) {
        timeOut = 0;
        document.getElementById("timeout-button").textContent = `Off`;
    }
}

const shuffle = (array) => array.sort(() => Math.random() - 0.5);

function createUniqueLP() {
    const unshuffledLP = [];
    for (let i = 0; i < 23; i++) {
        for (let j = 0; j < 23; j++) {
            if (i != j) {
                unshuffledLP.push(letters[i]+letters[j]);
            }
        }
    }
    return shuffle(unshuffledLP);
}

function goBack() {
    document.getElementById('results-page').style.display = 'none';
    document.getElementById('help-page').style.display = 'none';
    helpActive = false;
    document.getElementById('stats-page').style.display = 'none';
    statsActive = false;
    document.getElementById('settings-page').style.display = 'none';
    settingsActive = false;
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

function settings() {
    document.getElementById('start-page').style.display = 'none';
    document.getElementById('settings-page').style.display = 'block';
    settingsActive = true;
}
    
function closeSettings() {
    document.getElementById('settings-page').style.display = 'none';
    document.getElementById('start-page').style.display = 'block';
    settingsActive = false;
}

function processCSV() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a CSV file first.");
        return;
    }
    document.getElementById('remove-memop-button').style.display = 'block';
    document.getElementById('upload-button').style.display = 'none';
    document.getElementById('file-button').style.display = 'none';

    const reader = new FileReader();

    reader.onload = function(event) {
        const csvData = event.target.result;
        const listOfLists = parseCSV(csvData);
        memoP = listOfLists;
        localStorage.setItem('csvData', JSON.stringify(listOfLists));
        memoPActive = true;
    };

    reader.readAsText(file);
}

function parseCSV(data) {
    const rows = data.trim().split("\n");
    return rows.map(row => row.split(","));
}

function removeCSV() {
    memoP = [];
    localStorage.removeItem('csvData');
    document.getElementById('remove-memop-button').style.display = 'none';
    document.getElementById('upload-button').style.display = 'block';
    document.getElementById('file-button').style.display = 'block';
    const fileInput = document.getElementById('fileInput');
    fileInput.value = '';
    const customFileButton = document.getElementById('file-button');
    customFileButton.textContent = 'Choose File';
    customFileButton.style.backgroundColor = '#007BFF'; 
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
    times = [];
    letterPairs = [];
    if (uniqueLPList.length < numberOfPairs) {
        uniqueLPList = createUniqueLP();
    }
    for (let i = 0; i < numberOfPairs; i++) {
        letterPairs.push(uniqueLPList[i]);
    }
    document.getElementById('start-page').style.display = 'none';
    document.getElementById('training-page').style.display = 'block';
    document.getElementById("letter-pair").innerHTML = letterPairs[runningIndex];
    startTime = Date.now();
    timeAtStart = Date.now();
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
    currentTime = Math.round((endTime - startTime)/10) / 100
    times.push(currentTime);
    startTime = Date.now();
    runningIndex +=1;
    if (timeOut != 0 && currentTime > timeOut) {
        incrementBad();
        goodBad.push(false)
    } else {
        incrementGood();
        goodBad.push(true);
    }
    if (runningIndex >= numberOfPairs) {
        finishTraining();
    } else {
        document.getElementById("letter-pair").innerHTML = letterPairs[runningIndex];
    }
}

function bad() {
    endTime = Date.now();
    pauseActive = true;
    times.push(Math.round((endTime - startTime)/10) / 100);
    incrementBad();
    goodBad.push(false);
    document.getElementById('initial-buttons').style.display = 'none';
    document.getElementById('pause-buttons').style.display = 'flex';
    document.getElementById('solution').style.display = 'block';
    if (memoPActive) {
        document.getElementById("solution-memo").innerHTML = memoP[letters.indexOf(letterPairs[runningIndex][1])][letters.indexOf(letterPairs[runningIndex][0])];
    }
}

function resume() {
    runningIndex +=1;
    if (runningIndex >= numberOfPairs) {
        pauseActive = false;
        document.getElementById('initial-buttons').style.display = 'grid';
        document.getElementById('pause-buttons').style.display = 'none';
        document.getElementById('solution').style.display = 'none';
        finishTraining();
    } else {
        pauseActive = false;
        document.getElementById('initial-buttons').style.display = 'grid';
        document.getElementById('pause-buttons').style.display = 'none';
        document.getElementById('solution').style.display = 'none';
        startTime = Date.now();
        document.getElementById("letter-pair").innerHTML = letterPairs[runningIndex];
    }
}


function finishTraining() {
    timePerLP = Math.round((times.reduce((sum, num) => sum + num, 0)) * 100 / numberOfPairs)/100;
    uniqueLPList.splice(0, 23);
    document.getElementById("reset-button").textContent = uniqueLPList.length+'/506';
    updateTimePerLP();
    showResults();
    statsPerLP.push(timePerLP);
    let date = new Date(endTime);
    statsDates.push(date.toLocaleString());
    statsAccuracy.push(Math.round(100*numGood/numTotal)/100);
    localStorage.setItem('statsPerLP', JSON.stringify(statsPerLP));
    localStorage.setItem('statsDates', JSON.stringify(statsDates));
    localStorage.setItem('statsAccuracy', JSON.stringify(statsAccuracy));
    localStorage.setItem('uniqueLPList', JSON.stringify(uniqueLPList));
}

function showStats(where) {
    let avgList = [];
    const statsList = document.getElementById('stats-list').querySelector('tbody');
    statsList.innerHTML = ''; 
    for (let i = statsPerLP.length-1; i > -1; i--) {
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        timeCell.textContent = statsPerLP[i];
        row.appendChild(timeCell);
        const avgCell = document.createElement('td');
        if ( i > 3 ) {
            let fiveList = statsPerLP.slice(i-4, i+1);
            let sortedList = fiveList.sort((a, b) => a - b);
            let threeList = sortedList.slice(1, 4);
            let avg = threeList.reduce((sum, num) => sum + num, 0) / threeList.length;
            avgList.push(Math.round(100*avg)/100);
            avgCell.textContent = Math.round(100*avg)/100;
        } else {
            avgCell.textContent = '-';
        }
        row.appendChild(avgCell);
        const accuracyCell = document.createElement('td');
        accuracyCell.textContent = statsAccuracy[i] * 100 + '%';
        row.appendChild(accuracyCell);
        const dateCell = document.createElement('td');
        dateCell.textContent = statsDates[i];
        row.appendChild(dateCell);
        const actionCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '🗑️';  
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => {
            deleteStat(i); 
        });
        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);
        statsList.appendChild(row);
    }
    const pbList = document.getElementById('pb-list').querySelector('tbody');
    pbList.innerHTML = ' ';
    const singleRow = document.createElement('tr');
    const singleTextCell = document.createElement('td');
    singleTextCell.textContent = 'best single';
    singleRow.appendChild(singleTextCell);
    const singleCell = document.createElement('td');
    singleCell.textContent = Math.min(...statsPerLP);
    singleRow.appendChild(singleCell);
    pbList.appendChild(singleRow);
    const ao5Row = document.createElement('tr');
    const ao5TextCell = document.createElement('td');
    ao5TextCell.textContent = 'best Ao5';
    ao5Row.appendChild(ao5TextCell);
    const ao5Cell = document.createElement('td');
    ao5Cell.textContent = Math.min(...avgList);
    ao5Row.appendChild(ao5Cell);
    pbList.appendChild(ao5Row);
    const averageRow = document.createElement('tr');
    const averageTextCell = document.createElement('td');
    averageTextCell.textContent = 'overall average';
    averageRow.appendChild(averageTextCell);
    const averageCell = document.createElement('td');
    averageCell.textContent = Math.round((statsPerLP.reduce((sum, num) => sum + num, 0) /statsPerLP.length)*100)/100;
    averageRow.appendChild(averageCell);
    pbList.appendChild(averageRow);
    const accRow = document.createElement('tr');
    const accTextCell = document.createElement('td');
    accTextCell.textContent = 'average accuracy';
    accRow.appendChild(accTextCell);
    const accCell = document.createElement('td');
    accCell.textContent = Math.round((statsAccuracy.reduce((sum, num) => sum + num, 0) /statsAccuracy.length)*1000)/10 + '%';
    accRow.appendChild(accCell);
    pbList.appendChild(accRow);
    if (where == "settings") {
        document.getElementById('settings-page').style.display = 'none';
        document.getElementById('stats-page').style.display = 'block';
        statsFromSettings = true;
        settingsActive = false;
        statsActive = true;
    } else if (where == "results") {
        document.getElementById('results-page').style.display = 'none';
        document.getElementById('stats-page').style.display = 'block';
        statsFromResults = true;
        statsActive = true;
    } else {
        document.getElementById('stats-page').style.display = 'block';
        statsActive = true;
    }
}


function closeStats() {
    if (statsFromSettings) {
        document.getElementById('stats-page').style.display = 'none';
        document.getElementById('settings-page').style.display = 'block';
        statsFromSettings = false;
        settingsActive = true;
        statsActive = false;
    } else if (statsFromResults) {
        document.getElementById('stats-page').style.display = 'none';
        document.getElementById('results-page').style.display = 'block';
        statsFromResults = false;
        statsActive = false;
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
        if (memoPActive) {
            const middleSpan = document.createElement('span');
            middleSpan.textContent = memoP[targets[2*i + 1]][targets[2*i]];
            middleSpan.textContent = memoP[letters.indexOf(letterPairs[i][1])][letters.indexOf(letterPairs[i][0])];
            li.appendChild(middleSpan);
        }
        li.appendChild(rightSpan);
        combinedList.appendChild(li);
    }
    document.getElementById('training-page').style.display = 'none';
    document.getElementById('results-page').style.display = 'block';
}

function deleteStat(index) {
    statsPerLP.splice(index, 1);
    localStorage.setItem('statsPerLP', JSON.stringify(statsPerLP));
    statsDates.splice(index, 1);
    localStorage.setItem('statsDates', JSON.stringify(statsDates));
    statsAccuracy.splice(index, 1);
    localStorage.setItem('statsAccuracy', JSON.stringify(statsAccuracy));
    showStats(); 
}
