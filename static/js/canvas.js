import { config } from "./config.js";
import { possiblePaths } from "./dom.js";
import { removeAllCirles, removeAllPaths, calculatePossiblePaths} from "./utils.js"

export const svg = d3.select('#canvas')
  .append('svg')
  .attr('viewBox', `${config.bounds.xMin} ${config.bounds.yMin} ${config.bounds.width} ${config.bounds.height}`)
  .attr('preserveAspectRatio', 'xMidYMid meet')
  .style('position', 'absolute')
  .style('top', '0')
  .style('left', '0')
  .style('width', '100%') 
  .style('height', '100%')
  .style('overflow', 'visible')

// Create groups for lines and circles
export const lineGroup = svg.append('g').attr('class', 'lines');
export const circleGroup = svg.append('g').attr('class', 'circles');

export function updatePoints() {
        possiblePaths.innerText = calculatePossiblePaths(config.points.length);
        // Clear the circles and lines from the canvas
        removeAllCirles();
        removeAllPaths();

        // Create circles for each point
        circleGroup.selectAll('circle')
        .data(config.points)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 4)
        .attr('fill', 'rgb(212, 198, 198)');

        // Ensure the circle group is brought to the front
        svg.node().appendChild(circleGroup.node());
}


export function updateLines(solution, points, type) {
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
       .attr('stroke-width', 1.5);
}

export function toggleCursorEvent(event){
    const pt = svg.node().createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const svgPoint = pt.matrixTransform(svg.node().getScreenCTM().inverse());

    const x = svgPoint.x;
    const y = svgPoint.y;

    if (
        x >= config.bounds.xMin && x <= config.bounds.xMax &&
        y >= config.bounds.yMin && y <= config.bounds.yMax
    ) {
        svg.style('cursor', 'pointer');
    } else {
        svg.style('cursor', 'default');
    }
}