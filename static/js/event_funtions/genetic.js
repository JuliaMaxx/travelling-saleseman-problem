import { 
    selectionSelect, tournamentSizeInput, eliteCheck, eliteSizeInput, populationCount, populationRange, tournamentSizeRange, eliteSizeRange, tournamentSizeCount, eliteCount, mutationCount, greedyCount, epochCount } from "../dom.js";
import { toggleElementDisplay } from "../utils.js";

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

export function populateionRangeInput(){
    const populationValue = parseInt(populationRange.value);
    populationCount.textContent = populationValue;

    // Update the max value of the tournament and elite size range
    tournamentSizeRange.max = populationValue > 50? 50: populationValue;
    eliteSizeRange.max = populationValue > 50? 50: populationValue;

    // Adjust the value of the tournament size range if necessary
    if (parseInt(tournamentSizeRange.value) > populationValue) {
        tournamentSizeRange.value = Math.floor(populationValue / 3);
        tournamentSizeCount.textContent = tournamentSizeRange.value;
    } else {
        tournamentSizeCount.textContent = tournamentSizeRange.value;
    }

    // Adjust the value of the elite size range if necessary
    if (parseInt(eliteSizeRange.value) > populationValue) {
        eliteSizeRange.value = Math.floor(populationValue / 3);
        eliteCount.textContent = tournamentSizeRange.value;
    } else {
        eliteCount.textContent = tournamentSizeRange.value;
    }
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
