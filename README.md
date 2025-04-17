# Traveling Salesman *problem*? 

Welcome to the **Traveling Salesman *problem***! This web application allows you to explore and visualize various algorithms used to solve the **Traveling Salesman Problem (TSP)*

## Try it out: [Traveling Salesman problem?](https://travelling-saleseman-problem.onrender.com/)

![alt text](image-1.png)


## 🌟 Features

### 🗺️ Interactive Map with Points Selection
- **Random Points Generation:** Scatter up to `200 points` randomly on the map
- **Manual Points Selection:** Choose exact positions for each point on the map

### 🧠 Algorithm Options
- **Random Algorithm:** 
  - Generates a random solution
  - Generate an average of multiple random solutions
- **Greedy Algorithm (Nearest Neighbor)**
- **Genetic Algorithm:** A complex optimization algorithm with many customizable parameters:
  - Population size
  - Greedy ratio
  - Selection type `Tournament / Roulette`
  - Number of elites
  - Crossover method `Ordered / Partially Matched / Cycle`
  - Mutation method `Swap / Inversion`
  - Mutation probability
  - Number of epochs

### 🎮 Control and Interaction
- **Play / Pause / Stop Controls:** Start, pause, resume or stop the algorithm execution
- **Real-Time Speed Adjustment:** Change algorithm speed while it’s running
- **Live Algorithm Statistics:**
  - Elapsed time `in seconds`
  - Last distance calculated `in km`
  - For genetic algorithm:
    - Current epoch number
    - `Best / Worst / Average` distance in epoch

### 🌍 Map Visualization
- **Colorful, Configurable Map:** Each country is colorized with a random palette `can be updated on the fly`
- **Dynamic Path Visualization:** Color-coded paths to represent algorithm states:
  - 🟢 Green: Best distance found
  - 🔵 Blue: In-progress/random path
  - ⚪ White: Parents `Genetic`
  - 🌸 Pink: Child `Genetic`
  - 🔴 Red: Mutated child `Genetic`

### 📱 Mobile-Friendly UI
- Fully responsive layout and nav bar that becomes a burger button

## 🛠️ Technologies Used

- **Backend:** 
  - Python
  - Flask  
  → Algorithm logic written in Python for better performance and maintainability

- **Frontend:**
  -  HTML
  -  CSS
  -  JavaScript  
  → UI built with vanilla JS, styled with CSS, interactive visuals created with:
     - `D3.js` – For dynamic drawing of paths and points
     - `Socket.IO` – For real-time communication between Flask backend and JS frontend


## 🚀 How to Use

1. Launch the app in your browser
2. Select point generation method `random/manual`
3. Pick an algorithm
4. Optionally configure algorithm parameters `Genetic`
5. Click **Play** to start
6. Use **Pause** or **Stop** at any time
7. Adjust speed live using the speed slider
8. Watch the visualizations update in real-time and monitor stats
9. See the final solution `in km` displayed as **Distance*