import { config } from "../config.js";
import { svg } from "../canvas.js";
import { updatePoints } from "../canvas.js";

export function handleCanvasClick(event) {
    if (!config.isSelecting) return;
    if (config.points.length >= config.MAX_POINTS) {
        alert(`You can select a maximum of ${config.MAX_POINTS} points.`);
        return;
    }

    const pt = svg.node().createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;

    // Transform the point from screen coordinates to SVG coordinates
    const svgPoint = pt.matrixTransform(svg.node().getScreenCTM().inverse());

    const x = svgPoint.x;
    const y = svgPoint.y;

    // Check if the click is within the valid range
    if (x >= config.bounds.xMin && x <= config.bounds.xMax &&
        y >= config.bounds.yMin && y <= config.bounds.yMax) {
        
        config.points.push({ x, y });
        updatePoints();
    }
}


export function getValidRange(){
    const bounds = config.bounds;
    // Define the range for valid point selection
    const validRange = {
        xMin: parseInt(bounds.xMin),
        xMax: parseInt(bounds.xMax),
        yMin: parseInt(bounds.yMin),
        yMax: parseInt(bounds.yMax),
        width: parseInt(bounds.width),
        height: parseInt(bounds.height)
    };

    return validRange;
}