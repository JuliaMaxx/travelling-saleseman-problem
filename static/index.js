const pointRange = document.getElementById("pointRange");
const pointCount = document.getElementById("pointCount");
const canvas = document.getElementById("canvas");

let points = []

// Update the displayed number of points based on the range slider
pointRange.addEventListener("input", () => {
    pointCount.textContent = pointRange.value;
    generatePoints(parseInt(pointRange.value));
    sendCoordinatesToBackend(); 
});


// Generate and display points
function generatePoints(numPoints) {
    // Clear the canvas before generating new points
    canvas.innerHTML = '';
    for (let i = 0; i < numPoints; i++) {
        const x = Math.random() * canvas.clientWidth;
        const y = Math.random() * canvas.clientHeight;
        const pointElement = document.createElement('div');
        pointElement.classList.add('point');
        pointElement.style.left = `${x}px`;
        pointElement.style.top = `${y}px`;
        canvas.appendChild(pointElement);
        points.push({ id: i + 1, x: x, y: y });
    }
}