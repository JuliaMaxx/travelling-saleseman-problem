import { 
    selectionSelect, tournamentSizeInput, eliteCheck, eliteSizeInput, populationCount, populationRange, tournamentSizeRange, eliteSizeRange, tournamentSizeCount, eliteCount, mutationCount, greedyCount, epochCount } from "../dom.js";
import { toggleElementDisplay } from "../utils.js";
import { updateRangeBackground } from "./general.js";

export function selectionSelectChange(){
    if (selectionSelect.value === "tournament"){
        toggleElementDisplay(tournamentSizeInput, true);
    }
    else{
        toggleElementDisplay(tournamentSizeInput, false);
    }
}

export function eliteCheckChange(){
    if (eliteCheck.checked) {
        toggleElementDisplay(eliteSizeInput, true);

    } else {
        toggleElementDisplay(eliteSizeInput, false);
    }
}

function updateRangeInput(rangeInput, displayElement, maxLimit){
    const currentValue = parseInt(rangeInput.value);
    const clampedMax = Math.min(maxLimit, 50);
    rangeInput.max = clampedMax;

    if (currentValue > clampedMax) {
        rangeInput.value = clampedMax;
    }

    displayElement.textContent = rangeInput.value;
    updateRangeBackground(rangeInput);
}

function updateAllRanges(populationValue){
    updateRangeInput(tournamentSizeRange, tournamentSizeCount, populationValue);
    updateRangeInput(eliteSizeRange, eliteCount, populationValue);
}

export function populateionRangeInput(){
    const populationValue = parseInt(populationRange.value);
    populationCount.textContent = populationValue;

    updateAllRanges(populationValue)
}

export function tournamentSizeRangeInput(){
    tournamentSizeCount.textContent = tournamentSizeRange.value;
}

export function eliteSizeRangeInput(){
    eliteCount.textContent = eliteSizeRange.value;
}

export function greedyRangeInput(){
    greedyCount.textContent = greedyRange.value;
}

export function mutationRangeInput(){
    mutationCount.textContent = mutationRange.value;
}

export function epochRangeInput(){
    epochCount.textContent = epochRange.value;
}
