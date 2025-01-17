// General
const socket = io();
const canvas = document.getElementById("canvas");
const calculateBtn = document.getElementById("calculate");
const algorithmSelect = document.getElementById("algorithmSelect");
const speedRange = document.getElementById("speed");
const speedCount = document.getElementById("speedCount");

// Drawing points
const pointRange = document.getElementById("pointRange");
const pointCount = document.getElementById("pointCount");

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

// Clear everything on page load
window.onload = function() {
    socket.emit('get_points', { numPoints: numPoints });
    
};


// Update the displayed number of points based on the range slider
pointRange.addEventListener("input", () => {
    pointCount.textContent = pointRange.value;
    numPoints = parseInt(pointRange.value);

    // Send request to backend for new points
    socket.emit('get_points', { numPoints: numPoints });
});

// Update the speed of the algorithm
speedRange.addEventListener("input", () => {
    const delay = parseInt(speedRange.value)/100;
    socket.emit('update_delay', {delay: delay});
});

// Show or hide options based on the selected options
algorithmSelect.addEventListener("change", () => {
    if (algorithmSelect.value === "random") {
        randomOptions.style.display = "block";

        // hide genetic algorithm options
        geneticOptions.style.display = "none";
    }
    else if (algorithmSelect.value === "genetic"){
        geneticOptions.style.display = "block";
        
        // hide random algorithm options
        randomOptions.style.display = "none";
    } 
    else {
        randomOptions.style.display = "none";
        geneticOptions.style.display = "none";
    }
});

averageCheck.addEventListener("change", () => {
    if (averageCheck.checked) {
        averageCountInput.style.display = "block";
    } else {
        averageCountInput.style.display = "none";
    }
});

selectionSelect.addEventListener("change", () => {
    if (selectionSelect.value === "tournament"){
        tournamentSizeInput.style.display = "block";
    }
    else{
        tournamentSizeInput.style.display = "none";
    }
});

eliteCheck.addEventListener("change", () => {
    if (eliteCheck.checked) {
        eliteSizeInput.style.display = "block";
    } else {
        eliteSizeInput.style.display = "none";
    }
});


// Trigger the selected algorithm on button click
calculateBtn.addEventListener('click', () => {
    const selectedAlgorithm = algorithmSelect.value;
    let averageNum = 1;
    let populationSize = 50;
    let greedyRatio = 0.2;
    let selection = 1;
    let tournamentSize = 5;
    let elite = true;
    let eliteSize = 5;
    let crossover = 1;
    let mutation = 2;
    let mutationProbability = 0.1;
    let epochNum = 10;
    if (selectedAlgorithm === "random" && averageCheck.checked){
        averageNum = parseInt(averageRange.value);
    }
    else if (selectedAlgorithm === "genetic"){
        populationSize = parseInt(populationRange.value);
        greedyRatio = parseInt(greedyRange.value)/100;
        selection = selectionSelect.value == "tournament"? 1 : 2;
        tournamentSize = parseInt(tournamentSizeRange.value);
        elite = eliteCheck.value.checked? true: false;
        eliteSize = parseInt(eliteSizeRange.value);
        crossover = crossoverSelect.value == "ordered"? 1:
                    crossoverSelect.value == "partially matched"? 2: 3;
        mutation = mutationSelect.value == "swap"? 1: 2;
        mutationProbability = parseInt(mutationRange.value)/100;
        epochNum = parseInt(epochRange.value);
    }

    socket.emit('start_algorithm', { 
        algorithm: selectedAlgorithm,
        numPoints: numPoints,
        averageNum: averageNum,
        populationSize: populationSize,
        greedyRatio: greedyRatio,
        selection: selection,
        tournamentSize: tournamentSize,
        elite: elite,
        eliteSize: eliteSize,
        crossover: crossover,
        mutation: mutation,
        mutationProbability: mutationProbability,
        epochNum: epochNum
      });
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

populationRange.addEventListener("input", () => {
    populationCount.textContent = populationRange.value;
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


// Handle the points data from the backend
socket.on('receive_points', function(data) {
    points = data.points;
    updatePoints();
});

// Handle backend sending updates on algorithm progress
socket.on('update_lines', function(data) {
    const solution = data.solution;
    const points = data.points
    const type = data.type
    updateLines(solution, points, type);
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
        // Clear the circles and lines from the canvas
        circleGroup.selectAll('circle').remove();
        lineGroup.selectAll('path').remove();

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
    lineGroup.selectAll('path').remove();
    
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
       .attr('fill', 'none')
       .attr('stroke', lineColor)
       .attr('stroke-width', 2.5);
}