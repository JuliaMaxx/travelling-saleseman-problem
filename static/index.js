const socket = io();
const pointRange = document.getElementById("pointRange");
const pointCount = document.getElementById("pointCount");
const canvas = document.getElementById("canvas");
const calculateBtn = document.getElementById("calculate");

let points = []

// Update the displayed number of points based on the range slider
pointRange.addEventListener("input", () => {
    pointCount.textContent = pointRange.value;
    numPoints = parseInt(pointRange.value);

    // Send request to backend for new points
    socket.emit('get_points', { numPoints: numPoints });
});

// Trigger the greedy algorithm on a button click or event
calculateBtn.addEventListener('click', () => {
    const startingPoint = 0;
    socket.emit('start_greedy', {startingPoint: startingPoint});
});

// Handle the points data from the backend
socket.on('receive_points', function(data) {
    points = data.points;
    updatePoints();
});

// Event listener for the backend sending updates on the greedy algorithm progress
socket.on('update_lines', function(data) {
    const solution = data.solution;
    const points = data.points
    updateLines(solution, points);  // Update the lines progressively
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

// Update the canvas with D3.js visualization
function updateLines(solution, points) {
    const solutionPoints = solution.map(index => points[index]);

    // Clear lines from the canvas
    lineGroup.selectAll('path').remove();
    
    // No lines to draw if fewer than 2 points
    if (solutionPoints.length < 2) {
        return;
    }

    // Draw a path connecting the points
    const line = d3.line()
                   .x(d => d.x)
                   .y(d => d.y);

    lineGroup.append('path')
       .data([solutionPoints])
       .attr('d', line)
       .attr('fill', 'none')
       .attr('stroke', 'rgb(95, 85, 205)')
       .attr('stroke-width', 2.5);
}