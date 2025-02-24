// General
const socket = io();
const canvas = document.getElementById("canvas");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");
const algorithmSelect = document.getElementById("algorithmSelect");
const speedRange = document.getElementById("speed");
const speedCount = document.getElementById("speedCount");
const options = document.querySelectorAll('select option');
const colorRange = document.getElementById("color");
const paths = document.querySelectorAll('path:not(.calc)');
const rangeInputs = document.querySelectorAll('input[type="range"]');

// Info
const possiblePaths = document.getElementById("possiblePaths");
const bestDistance = document.getElementById("bestDistance");
const worseDistance = document.getElementById("worseDistance");
const averageDistance = document.getElementById("averageDistance");
const epoch = document.getElementById("epoch");
const elapsedTime = document.getElementById("elapsedTime");
const distance = document.getElementById("distance");

// Drawing points
const pointRange = document.getElementById("pointRange");
const pointCount = document.getElementById("pointCount");
const random = document.getElementById('random');
const manual = document.getElementById('manual');

// Random algorithm
const randomOptions = document.getElementById("randomOptions");
const averageCheck = document.getElementById("averageCheck");
const averageCountInput = document.getElementById("averageCountInput");
const averageRange = document.getElementById("averageRange");
const averageCount = document.getElementById("averageCount");

// Genetic algorithm
const geneticOptions = document.getElementById("geneticOptions");
const selectionSelect = document.getElementById("selectionSelect");
const crossoverSelect = document.getElementById("crossoverSelect");
const mutationSelect = document.getElementById("mutationSelect");
const tournamentSizeInput = document.getElementById("tournamentSizeInput");
const tournamentSizeRange = document.getElementById("tournamentSizeRange");
const tournamentSizeCount = document.getElementById("tournamentSizeCount");
const eliteSizeRange = document.getElementById("eliteSizeRange");
const eliteCheck = document.getElementById("eliteCheck");
const eliteSizeInput = document.getElementById("eliteSizeInput");
const eliteCount = document.getElementById("eliteCount");
const populationRange = document.getElementById("populationRange");
const populationCount = document.getElementById("populationCount");
const greedyRange = document.getElementById("greedyRange");
const greedyCount = document.getElementById("greedyCount");
const mutationRange = document.getElementById("mutationRange");
const mutationCount = document.getElementById("mutationCount");
const epochRange = document.getElementById("epochRange");
const epochCount = document.getElementById("epochCount");

let numPoints = parseInt(pointRange.value);
let points = [];
let isPaused = false;
let isSelecting = false;
const MAX_POINTS = 200;
let algorithmSet = false;
let elapsedTimeInSeconds = 0;
let intervalId = null; 

paths.forEach(path => {
path.style.fill = getRandomHSL();
});

// Clear everything on page load
window.onload = function() {
    resetToInitialState();
};


function manualSelection() {
    if (!isSelecting){
        points = []
        toggleManualButtonText(false);
        removeAllCirles();
        removeAllPaths();
        [pointRange, algorithmSelect, playBtn].forEach(el => toggleButtonState(el, true));
        toggleCursor(true);
        isSelecting = true;
    }
    else {
        if (points.length < 1){
            toggleButtonState(pointRange, false);
            socket.emit('get_points', { numPoints: numPoints, manual: false });
            isSelecting = false;
        }
        else{
            socket.emit('get_points', { numPoints: points, manual: true });
        }
        toggleControls(algorithmSet? false: true, false, false);
        toggleManualButtonText(true);
        toggleCursor(false);
        isSelecting = false;
    }
}

function toggleCursor(isSelecting){
    canvas.style.cursor = isSelecting? "pointer": "default" ;
}

function removeAllCirles(){
    circleGroup.selectAll('circle').remove();
}

function removeAllPaths(){
    lineGroup.selectAll('path').remove();
}

function toggleManualButtonText(isSelecting){
    manual.innerText = isSelecting? "Manual": "Finish";
}


manual.addEventListener("click", manualSelection);

// Update the displayed number of points based on the range slider
pointRange.addEventListener("input", pointRangeInput);

// Update the speed of the algorithm
speedRange.addEventListener("input", speedRangeInput);

// Show or hide options based on the selected options
algorithmSelect.addEventListener("change", algorithmSelectChange);

averageCheck.addEventListener("change", averageCheckChange);

selectionSelect.addEventListener("change", selectionSelectChange);

eliteCheck.addEventListener("change",eliteCheckChange);

// Trigger the selected algorithm on button click
playBtn.addEventListener('click', () => {
    playAlgorithm();
});

pauseBtn.addEventListener("click", () => {
    pauseAlgorithm();
});

stopBtn.addEventListener("click", () => {
    stopAlgorithm();
});

// Update range span values
averageRange.addEventListener("input", () => {
    averageCount.textContent = averageRange.value;
});

tournamentSizeRange.addEventListener("input", () => {
    tournamentSizeCount.textContent = tournamentSizeRange.value;
});

eliteSizeRange.addEventListener("input", () => {
    eliteCount.textContent = eliteSizeRange.value;
});

populationRange.addEventListener('input', () => {
    populateionRangeInput();
});

greedyRange.addEventListener("input", () => {
    greedyCount.textContent = greedyRange.value;
});

mutationRange.addEventListener("input", () => {
    mutationCount.textContent = mutationRange.value;
});

epochRange.addEventListener("input", () => {
    epochCount.textContent = epochRange.value;
});

speedRange.addEventListener("input", () => {
    speedCount.textContent = speedRange.value;
});

colorRange.addEventListener("input", colorRangeInput);


// Handle the points data from the backend
socket.on('receive_points', function(data) {
    points = data.points;
    updatePoints();
});

// Display information about the epoch
socket.on('update_info', function(data) {
    bestDistance.textContent = `Best distance: ${data['best']}`
    worseDistance.textContent = `Worse distance: ${data['worse']}`
    averageDistance.textContent = `Average distance: ${data['average']}`
    epoch.textContent = `Epoch ${data['epoch']}`
});

// Display distance in genetic and random solutions
socket.on('update_distance', function(data) {
    distance.textContent = `Distance: ${data['distance']}`
});

// Display distance in genetic and random solutions
socket.on('update_average_distance', function(data) {
    distance.textContent = `Average Distance: ${data['distance']}`
});

// Handle backend sending updates on algorithm progress
socket.on('update_lines', function(data) {
    const solution = data.solution;
    const points = data.points
    const type = data.type
    updateLines(solution, points, type);
});

socket.on('algorithm_finished', function(data) {
    // Stop the algorithm
    socket.emit('stop_algorithm', {});
    stopTimer(intervalId);
    togglePlayButtonText(false);
    toggleControls(false, true, true);
    [pointRange, manual, algorithmSelect].forEach(el => toggleButtonState(el, false));
});


// Set up the D3 canvas
const svg = d3.select('#canvas')
.append('svg')
.attr('width', canvas.clientWidth)
.attr('height', canvas.clientHeight);

// Create groups for lines and circles
const lineGroup = svg.append('g').attr('class', 'lines');
const circleGroup = svg.append('g').attr('class', 'circles');


function updatePoints() {
        possiblePaths.innerText = calculatePossiblePaths(points.length);
        // Clear the circles and lines from the canvas
        removeAllCirles();
        removeAllPaths();

        // Create circles for each point
        circleGroup.selectAll('circle')
        .data(points)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 7)
        .attr('fill', 'rgb(212, 198, 198)');

        // Ensure the circle group is brought to the front
        svg.node().appendChild(circleGroup.node());
}


function updateLines(solution, points, type) {
    const solutionPoints = solution.map(index => points[index]);

    // Clear lines from the canvas
    removeAllPaths();
    
    // No lines to draw if fewer than 2 points
    if (solutionPoints.length < 2 || pointRange.value == 1) {
        return;
    }

    // Determine line color based on type
    let lineColor;
    switch (type) {
        case 'parent':
            lineColor = 'rgb(150, 150, 150)'; // Gray for parents
            break;
        case 'crossover':
            lineColor = 'rgb(255, 85, 205)'; // Purple for crossover
            break;
        case 'mutation':
            lineColor = 'rgb(255, 69, 0)'; // Red for mutation
            break;
        case 'best':
            lineColor = 'rgb(0, 255, 0)'; // Green for best
            break;
        default:
            lineColor = 'rgb(95, 85, 205)'; // Blue for unknown
    }

    // Draw a path connecting the points
    const line = d3.line()
                   .x(d => d.x)
                   .y(d => d.y);

    lineGroup.append('path')
       .data([solutionPoints])
       .attr('d', line)
       .attr('class', 'calc')
       .attr('fill', 'none')
       .attr('stroke', lineColor)
       .attr('stroke-width', 2.5);
}

// Define the range for valid point selection
const validRange = {
    xMin: 50,
    xMax: 1350,
    yMin: 7,
    yMax: 830,
};

// Function to handle canvas clicks
function handleCanvasClick(event) {
    if (!isSelecting) return;
    if (points.length >= MAX_POINTS) {
        alert(`You can select a maximum of ${MAX_POINTS} points.`);
        return;
    }
    // Get the position of the click relative to the canvas
    const rect = svg.node().getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if the click is within the valid range
    if (x >= validRange.xMin && x <= validRange.xMax && y >= validRange.yMin && y <= validRange.yMax) {
        // Add the new point to the array
        points.push({ x, y });

        // Update the canvas
        updatePoints();
    }
}

// Add the click event listener to the canvas
svg.on('click', handleCanvasClick);


function factorial(n) {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function calculatePossiblePaths(numPoints) {
    // Calculate factorial (numPoints - 1)!
    let fact = factorial(numPoints - 1);

    // Find the exponent of 10
    let exponent = Math.floor(Math.log10(fact));
    
    // Normalize the number in the form of n * 10^m
    let mantissa = fact / Math.pow(10, exponent);
    
    // Round mantissa to 3 decimal places for simplicity
    mantissa = mantissa.toFixed(3);
    if (isNaN(mantissa)){
        return "Possibilities: infinity"
    }
    return `Possibilities: ${mantissa} * 10^${exponent}`;
}

// Begin counting elapsed time
function startTimer() {   
    if (intervalId === null) {
        intervalId = setInterval(() => {
            if (!isPaused) { // Update only if not paused
                elapsedTimeInSeconds++;
                elapsedTime.textContent = `Elapsed: ${elapsedTimeInSeconds}`;
            }
        }, 1000);
    }
}

function stopTimer() {
    elapsedTimeInSeconds = 0;
    clearInterval(intervalId);
    intervalId = null;
}

function resetAllText(){
    elapsedTime.textContent = "Elapsed: 0";
    bestDistance.textContent = "Best: 0";
    worseDistance.textContent = "Worse: 0";
    averageDistance.textContent = "Average: 0";
    epoch.textContent = "Epoch: 0";
    distance.textContent = "Distance: 0";
    playBtn.innerText = "Play";
    toggleManualButtonText(true);
}

 // Function to update the background of a range input
 function updateRangeBackground(rangeInput) {
     const value = rangeInput.value;
     const percentage = ((value - rangeInput.min) / (rangeInput.max - rangeInput.min)) * 100;
     rangeInput.style.setProperty('--value', `${percentage}%`);
 }

 // Attach event listeners to all range inputs
 rangeInputs.forEach(input => {
     input.addEventListener('input', () => updateRangeBackground(input));
     // Initialize background on page load
     updateRangeBackground(input);
 });


// Function to generate a random non-green color (in HSL)
function getRandomHSL() {
    let h;
  
    // Loop to generate a hue outside the green range (80° - 160°)
    do {
      h = Math.floor(Math.random() * 360);
    } while (h >= 70 && h <= 170);
  
    const s = Math.floor(Math.random() * 31) + 70;
    const l = Math.floor(Math.random() * 20) + 2;
    return `hsl(${h}, ${s}%, ${l}%)`;
}

function toggleElementDisplay(element, show){
    element.style.display = show ? "block" : "none";
}

function toggleButtonState(button, isDisabled){
    button.disabled = isDisabled;
}

function toggleControls(play, pause, stop){
    toggleButtonState(stopBtn, stop);
    toggleButtonState(pauseBtn, pause);
    toggleButtonState(playBtn, play);
}

function togglePlayButtonText(isPaused){
    playBtn.innerText = isPaused? "Resume": "Play";
}

function resetToInitialState(){
    socket.emit('get_points', { numPoints: numPoints, manual: false });
    socket.emit('stop_algorithm', {});
    stopTimer(intervalId);
    removeAllPaths();
    toggleCursor(false);
    [pointRange, manual, algorithmSelect].forEach(el => toggleButtonState(el, false));
    toggleControls(true, true, true);
    resetAllText();
    isPaused = false;
}

function populateionRangeInput(){
    const populationValue = parseInt(populationRange.value);
    populationCount.textContent = populationValue;

    // Update the max value of the tournament and elite size range
    tournamentSizeRange.max = populationValue > 50? 50: populationValue;
    eliteSizeRange.max = populationValue > 50? 50: populationValue;

    // Adjust the value of the tournament size range if necessary
    if (parseInt(tournamentSizeRange.value) > populationValue) {
        tournamentSizeRange.value = Math.floor(populationValue / 3);
        tournamentSizeCount.textContent = tournamentSizeRange.value;
    } else {
        tournamentSizeCount.textContent = tournamentSizeRange.value;
    }

    // Adjust the value of the elite size range if necessary
    if (parseInt(eliteSizeRange.value) > populationValue) {
        eliteSizeRange.value = Math.floor(populationValue / 3);
        eliteCount.textContent = tournamentSizeRange.value;
    } else {
        eliteCount.textContent = tournamentSizeRange.value;
    }
}

function stopAlgorithm(){
    // Stop the algorithm
    isPaused = false;
    stopTimer(intervalId);
    socket.emit('stop_algorithm', {});
    removeAllPaths();
    togglePlayButtonText(isPaused);
    [pointRange, manual, algorithmSelect].forEach(el => toggleButtonState(el, false));
    toggleControls(false, true, true);
    resetAllText();
}

function pauseAlgorithm(){
    // Pause the algorithm
    socket.emit('pause_algorithm', {});
    toggleControls(false, true, false);
    isPaused = true;
    togglePlayButtonText(isPaused);
}

// Function to get algorithm-specific parameters
function getAlgorithmParams(selectedAlgorithm) {
    if (selectedAlgorithm === "random") {
        return { averageNum: averageCheck.checked ? parseInt(averageRange.value) : 1 };
    } 
    
    if (selectedAlgorithm === "genetic") {
        return {
            populationSize: parseInt(populationRange.value),
            greedyRatio: parseInt(greedyRange.value) / 100,
            selection: selectionSelect.value === "tournament" ? 1 : 2,
            tournamentSize: parseInt(tournamentSizeRange.value),
            elite: eliteCheck.checked,
            eliteSize: parseInt(eliteSizeRange.value),
            crossover : crossoverSelect.value == "ordered"? 1:
                        crossoverSelect.value == "partially matched"? 2: 3,
            mutation: mutationSelect.value === "swap" ? 1 : 2,
            mutationProbability: parseInt(mutationRange.value) / 100,
            epochNum: parseInt(epochRange.value),
        };
    }
}

function playAlgorithm(){
    const selectedAlgorithm = algorithmSelect.value;
    if (selectedAlgorithm !== "random" || averageCheck.checked) {
        [pointRange, manual, algorithmSelect].forEach(el => toggleButtonState(el, true));
        startTimer();
    }

    if (!isPaused) {
        removeAllPaths();
        const params = getAlgorithmParams(selectedAlgorithm);

        socket.emit("start_algorithm", {
            algorithm: selectedAlgorithm,
            numPoints,
            ...params,
        });

        if (selectedAlgorithm === 'random' && !averageCheck.checked){
            toggleControls(false, true, true);
        }
        else
        {
            toggleControls(true, false, false);
        }
    } else {
        // Resume the algorithm when paused
        socket.emit('resume_algorithm', {});
        startTimer();
        toggleControls(true, false, false);
        isPaused = false;
    }
}

function pointRangeInput(){
    pointCount.textContent = pointRange.value;
    numPoints = parseInt(pointRange.value);

    // Send request to backend for new points
    socket.emit('get_points', { numPoints: numPoints, manual: false });
}

function speedRangeInput(){
    const delay = speedRange.value/100;
    socket.emit('update_delay', {delay: delay});
}

function algorithmSelectChange(){
    algorithmSet = true;
    toggleControls(false, true, true);
    resetAllText();
    if (algorithmSelect.value === "random") {
        toggleElementDisplay(randomOptions, true);
        if (!averageCheck.checked){
            toggleControls(false, true, true);
        }
        // hide genetic algorithm options
        toggleElementDisplay(geneticOptions, false);
        distance.textContent = `Distance: 0`
        averageCheck.checked = false;
    }
    else if (algorithmSelect.value === "genetic"){
        toggleElementDisplay(geneticOptions, true);
        // hide random algorithm options
        toggleElementDisplay(randomOptions, false);
    } 
    else {
        distance.textContent = `Distance: 0`
        toggleElementDisplay(geneticOptions, false);
        toggleElementDisplay(randomOptions, false);
    }
}

function averageCheckChange(){
    if (averageCheck.checked) {
        distance.textContent = `Average Distance: 0`
        toggleElementDisplay(averageCountInput, true);
    } else {
        distance.textContent = `Distance: 0`
        toggleElementDisplay(averageCountInput, false);
    }
}


function selectionSelectChange(){
    if (selectionSelect.value === "tournament"){
        toggleElementDisplay(tournamentSizeInput, true);
    }
    else{
        toggleElementDisplay(tournamentSizeInput, false);
    }
}

function eliteCheckChange(){
    if (eliteCheck.checked) {
        toggleElementDisplay(eliteSizeInput, true);

    } else {
        toggleElementDisplay(eliteSizeInput, false);
    }
}

function colorRangeInput(){
    const paths = document.querySelectorAll('path:not(.calc)');
    paths.forEach(path => {
    path.style.fill = getRandomHSL();
    });
}
