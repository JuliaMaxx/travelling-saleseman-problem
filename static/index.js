const socket = io();
const pointRange = document.getElementById("pointRange");
const pointCount = document.getElementById("pointCount");
const canvas = document.getElementById("canvas");

let points = []

// Update the displayed number of points based on the range slider
pointRange.addEventListener("input", () => {
    pointCount.textContent = pointRange.value;
    numPoints = parseInt(pointRange.value);

    // Send request to backend for new points
    socket.emit('get_points', { numPoints: numPoints });
});

// Handle the points data from the backend
socket.on('receive_points', function(data) {
    points = data.points;
    updateCanvas();
});

// Update the canvas with D3.js visualization
function updateCanvas() {
    // Clear the canvas
    d3.select('#canvas').html('');

    // Set up the D3 canvas
    const svg = d3.select('#canvas')
    .append('svg')
    .attr('width', canvas.clientWidth)
    .attr('height', canvas.clientHeight);
    
    // Draw a path connecting the points
    const line = d3.line()
                   .x(d => d.x)
                   .y(d => d.y);

    svg.append('path')
       .data([points])
       .attr('d', line)
       .attr('fill', 'none')
       .attr('stroke', 'rgb(95, 85, 205)')
       .attr('stroke-width', 2.5);

    // Create circles for each point
    svg.selectAll('circle')
       .data(points)
       .enter()
       .append('circle')
       .attr('cx', d => d.x)
       .attr('cy', d => d.y)
       .attr('r', 7)
       .attr('fill', 'rgb(212, 198, 198)');

}