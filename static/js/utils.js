import { config } from "./config.js";
import { 
    canvas, playBtn, pauseBtn, stopBtn, manual, averageCheck, averageRange, populationRange, greedyRange, selectionSelect, tournamentSizeRange, eliteCheck, eliteSizeRange, crossoverSelect, mutationSelect, mutationRange, epochRange, pointRange, algorithmSelect, paths, elapsedTime, bestDistance, worseDistance, averageDistance, epoch, distance, nav, hamburgerBtn } from "./dom.js";
import { circleGroup, lineGroup } from "./canvas.js";
import { socket } from "./socket.js";
import { stopTimer } from "./timer.js";
import { toggleCursorEvent } from "./canvas.js";
import { emitGetPoints } from "./socket.js";

export function toggleCursor(isSelecting){
    if (isSelecting){
        canvas.addEventListener('mousemove', toggleCursorEvent);
    }
    else {
        canvas.removeEventListener('mousemove', toggleCursorEvent);
        canvas.style.cursor = 'default';
    }

}

export function removeAllCirles(){
    circleGroup.selectAll('circle').remove();
}

export function removeAllPaths(){
    lineGroup.selectAll('path').remove();
}

export function toggleElementDisplay(element, show){
    element.style.display = show ? "block" : "none";
}

export function toggleButtonState(button, isDisabled){
    button.disabled = isDisabled;
}

export function toggleControls(play, pause, stop){
    toggleButtonState(stopBtn, stop);
    toggleButtonState(pauseBtn, pause);
    toggleButtonState(playBtn, play);
}

export function togglePlayButtonText(isPaused){
    playBtn.innerText = isPaused? "Resume": "Play";
}

export function toggleManualButtonText(isSelecting){
    manual.innerText = isSelecting? "Manual": "Finish";
}

export function getAlgorithmParams(selectedAlgorithm) {
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

export function factorial(n) {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

export function getRandomHSL() {
    let h;
    // Loop to generate a hue outside the green range (80° - 160°)
    do {
      h = Math.floor(Math.random() * 360);
    } while (h >= 70 && h <= 170);
  
    const s = Math.floor(Math.random() * 41) + 100;
    const l = Math.floor(Math.random() * 10) + 16;
    return `hsl(${h}, ${s}%, ${l}%)`;
}

export function calculatePossiblePaths(numPoints) {
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

export function resetToInitialState(){
    emitGetPoints(config.numPoints, false);
    socket.emit('stop_algorithm', {});
    stopTimer(config.intervalId);
    removeAllPaths();
    toggleCursor(false);
    [pointRange, manual, algorithmSelect].forEach(el => toggleButtonState(el, false));
    toggleControls(true, true, true);
    resetAllText();
    config.isPaused = false;
    paths.forEach(path => {
        path.style.fill = getRandomHSL();
    });
}

export function resetAllText(){
    elapsedTime.textContent = "Elapsed: 0s";
    bestDistance.textContent = "Best: 0km";
    worseDistance.textContent = "Worse: 0km";
    averageDistance.textContent = "Average: 0km";
    epoch.textContent = "Epoch: 0";
    distance.textContent = "Distance: 0km";
    playBtn.innerText = "Play";
    toggleManualButtonText(true);
}

export function hamburgerClick(){
    nav.classList.toggle('active');
    if (nav.classList.contains('active')){
        hamburgerBtn.style.width = `${nav.clientWidth}px`;
        hamburgerBtn.style.left = '0';
        hamburgerBtn.style.top = '-5px';
    }
    else {
        hamburgerBtn.style.position = "absolute";
        hamburgerBtn.style.width = '4.5rem';
        hamburgerBtn.style.top = '0.5rem';
        hamburgerBtn.style.left = '0.5rem';
    }
}

const resizeObserver = new ResizeObserver(() => {
    if (nav.classList.contains('active')) {
        hamburgerBtn.style.width = `${nav.clientWidth}px`;
    }
});
resizeObserver.observe(nav);