import { averageCheck, distance, averageCountInput, averageCount, averageRange } from "../dom.js";
import { toggleElementDisplay } from "../utils.js";

export function averageCheckChange(){
    if (averageCheck.checked) {
        distance.textContent = `Average Distance: 0km`
        toggleElementDisplay(averageCountInput, true);
    } else {
        distance.textContent = `Distance: 0km`
        toggleElementDisplay(averageCountInput, false);
    }
}

export function averageRangeInput(){
    averageCount.textContent = averageRange.value;
}