# Functionality Unit
## Initial
- Manual button enabled √
- Algorithm button enabled √
- Controls disabled √
- 10 points displayed √
- Distance in km √
- Elapsed in secods √

## Mobile Compatibility
- Laptop scaling works √
- Burger menu for tablets and mobile √
- Map flip for mobile √
- Menu scales properly for mobile and tablet ❌

## Point selection
- Automatic
    - Proper amount √
    - Points are all within bondaries 
        - Desctop and tablet sizes √
        - Mobile size ❌
    - Possibilities change properly √
    - Minimum 5 points √
- Manual
    - Let's you insert up to 200 points √
    - Points are all within bondaries 
        - Desctop √
        - Mobile and small tablet size ❌
    - Possibilities change properly √
    - Minimum 5 points √
    - On click turns button to "Finish" √
        - Disables algorithm selection √
        - Disables controls √
        - Disables automatic range √
    - If no points chosen, back to automatic √
    - Pointer cursor √
    - Cursor resets after clicking "Finish" ❌

## Map color
- Range changes map color to random non-green colors √

## Visualization delay
- Works to slowdown/speedup each algorithm √

## Algorithms
### Greedy
- "Play" button enabled √
- Distance is shown between each point √
- Total distance in the end √
- Elapsed seconds √
- Pause/Resume √
- Stop √
### Random
- "Play" button enabled √
- "Calculate average is disabled by default" √
- Total distance shown √
- When calculate average is checked
    - Range appears √
    - On Play average distance is calculated √
    - Elapsed seconds √
    - Pause/Resume √
    - Stop √
    - Average distance is displayed in the end √
    - On Play
        - Point selection is disabled √
        - Algorithm selection is disabled √
        - Calculate Average is disabled  ❌
- Range dissapears when average is unchecked √
- Settings are saved when comming from other options ❌
    - Calculate Average is unckecked
### Genetic
- "Play" button is enabled √
- Play/Resume √
- Pause on low speed √
- Stop on low speed √
- Pause on high speed ❌
- Stop on high speed ❌
- Stop resets text data √
    - Dstance resets ❌
- Play resets epoch data ❌
- Distance shown √
- Elapsed shown √
- Epoch shown √
- Best shown in km √
- Worst shown in km √
- Average shown in km √
- Everything except controls, delay and color is disabled during execution ❌
- Epoch range 
    - Min 2 ❌
    - Max 100 √
- Greedy Ration range
    - Min 0 √
    - Max 100 √
- Mutation
    - Swap √
    - Inversion √
    - Min 1 √
    - Max 100 √
- Population Size
    - Min 3 √
    - Max 200 √
- Crossover
    - Ordered √
    - Partially Matched √
    - Cycle √
- Selection 
    - Tournament √
        - Range appears when checked √
        - If population >= 50
            - Min 3 √
            - Max 50 √
            - Range visuals √
        - If population < 50
            - Min 3 √
            - Max = population size √
            - Range visuals ❌
    - Roulette √
- Elite
    - Range appears when checked √
    - If population >= 50
        - Min 3 √
        - Max 50 √
        - Range visuals √
    - If population < 50
        - Min 3 √
        - Max = population size √
        - Range visuals ❌
- Works with highest load: 200p-100ep √
- Settings are saved when comming from other algorithms √

## Page reload
- Back to default settings
    - Greedy √
    - Random average √
    - Genetic low speed √
    - Genetic high speed ❌
        - distance shown
        - paths shown

## Page resize
- New map √
- If algorithm is selected Play is enabled ❌
- If no algorithm selected Play is disabled √