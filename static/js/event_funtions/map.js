import { config } from "../config.js";
import { svg } from "../canvas.js";
import { updatePoints } from "../canvas.js";

export function handleCanvasClick(event) {
    if (!config.isSelecting) return;
    if (config.points.length >= config.MAX_POINTS) {
        alert(`You can select a maximum of ${config.MAX_POINTS} points.`);
        return;
    }
    // Get the position of the click relative to the canvas
    const rect = svg.node().getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if the click is within the valid range
    if (x >= validRange.xMin && x <= validRange.xMax && y >= validRange.yMin && y <= validRange.yMax) {
        // Add the new point to the array
        config.points.push({ x, y });

        // Update the canvas
        updatePoints();
    }
}

// Define the range for valid point selection
const validRange = {
    xMin: 50,
    xMax: 1350,
    yMin: 7,
    yMax: 830,
};
