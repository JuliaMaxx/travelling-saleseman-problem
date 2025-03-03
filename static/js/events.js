import{
    manual, colorRange, pointRange, speedRange, algorithmSelect, rangeInputs, playBtn, pauseBtn, stopBtn, averageCheck, selectionSelect, eliteCheck, averageRange, populationRange, tournamentSizeRange, eliteSizeRange, greedyRange, mutationRange, epochRange } from "./dom.js"
import { svg } from "./canvas.js";
import { 
    manualSelection, colorRangeInput, pointRangeInput, speedRangeInput, algorithmSelectChange, updateRangeBackground } from "./event_funtions/general.js"
import { playAlgorithm, pauseAlgorithm, stopAlgorithm } from "./event_funtions/controls.js"
import { handleCanvasClick } from "./event_funtions/map.js"
import { averageCheckChange, averageRangeInput } from "./event_funtions/random.js"
import { 
    selectionSelectChange, eliteCheckChange, populateionRangeInput, tournamentSizeRangeInput, eliteSizeRangeInput, greedyRangeInput, mutationRangeInput, epochRangeInput 
} from "./event_funtions/genetic.js";

export function setUpEventListeners(){
    // general
    manual.addEventListener("click", manualSelection);
    colorRange.addEventListener("input", colorRangeInput);
    pointRange.addEventListener("input", pointRangeInput);
    speedRange.addEventListener("input", speedRangeInput);
    algorithmSelect.addEventListener("change", algorithmSelectChange);
    rangeInputs.forEach(input => {
        input.addEventListener('input', () => updateRangeBackground(input));
        updateRangeBackground(input);
    });
    // controls
    playBtn.addEventListener('click', playAlgorithm);
    pauseBtn.addEventListener("click", pauseAlgorithm);
    stopBtn.addEventListener("click", stopAlgorithm);
    //map
    svg.on('click', handleCanvasClick);
    // random
    averageCheck.addEventListener("change", averageCheckChange);
    averageRange.addEventListener("input", averageRangeInput);
    // genetic
    selectionSelect.addEventListener("change", selectionSelectChange);
    eliteCheck.addEventListener("change",eliteCheckChange);
    populationRange.addEventListener('input', populateionRangeInput);
    tournamentSizeRange.addEventListener("input", tournamentSizeRangeInput);
    eliteSizeRange.addEventListener("input", eliteSizeRangeInput);
    greedyRange.addEventListener("input", greedyRangeInput);
    mutationRange.addEventListener("input", mutationRangeInput);
    epochRange.addEventListener("input", epochRangeInput);
}    