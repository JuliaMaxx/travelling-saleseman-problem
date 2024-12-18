import pandas as pd
import math
import random

def parse_tsp(filename):
    with open(filename, "r") as file:
        lines = file.readlines()
        
    # Start and end of coordinates
    start_index = lines.index("NODE_COORD_SECTION\n") + 1
    end_index = lines.index("EOF\n")
    
    # Extract coordinate lines
    data_lines = lines[start_index:end_index]
    
    # Separate data into parts
    data = []
    for line in data_lines:
        parts = line.strip().split()
        x = float(parts[1])
        y = float(parts[2])
        data.append([x, y])
    DF = pd.DataFrame(data, columns=['x', 'y'])
    return DF

DF = parse_tsp('berlin11.tsp')
INDEXES = DF.index.to_list()

def distance_between(x1, x2, y1, y2):
    result = math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
    return round(result, 3)

def random_solution():
   shuffled_INDEXES = INDEXES.copy()
   random.shuffle(shuffled_INDEXES)
   
   # Ensure the solution returns to the starting city
   shuffled_INDEXES.append(shuffled_INDEXES[0])
   return shuffled_INDEXES

def fitness(solution):
    # [9, 1, 4, 0, 10, 3, 7, 8, 6, 5, 2]
    total_distance = 0
    if len(solution) > 1:
        for i in range(len(solution) - 1):
            # Calculate INDEXES
            current_index = solution[i]
            next_index = solution[i + 1]
            
            # Calculate Distance
            distance = distance_between(
                DF.iloc[current_index]['x'], DF.iloc[next_index]['x'],
                DF.iloc[current_index]['y'], DF.iloc[next_index]['y']
            )
            total_distance += distance
    return round(total_distance, 3)

def print_result(solution):
    for i, city in enumerate(solution):
        if i < len(solution) - 1:
            print(city, end=" ⇢  ")
        else:
            print(city)
    total_distance = fitness(solution)
    print(f"Total Distance: {total_distance}")
    
def greedy_solution(starting_point):
    remaining_INDEXES = INDEXES.copy()
    
    # Add starting point as the fist city in the solution
    solution = [starting_point]
    
    while len(remaining_INDEXES) > 1:
        remaining_INDEXES.remove(starting_point)   
        shortest_distance = float('inf')
        next_city = -1
        
        # Calculate what is the closest city to the current one
        for i in remaining_INDEXES:
            distance = distance_between(
                DF.iloc[i]['x'], DF.iloc[starting_point]['x'],
                DF.iloc[i]['y'], DF.iloc[starting_point]['y']
                )
            if distance < shortest_distance:
                shortest_distance = distance
                next_city = i
                
        solution.append(next_city)
        starting_point = next_city 
    solution.append(solution[0])
    return solution
 
# Find what is the best city to start from 
def find_the_best():
    shortest = float('inf')
    city = 0
    for i in INDEXES:
        distance = fitness(greedy_solution(i))
        if distance < shortest:
            shortest = distance
            city = i
    return city

# Find the avegrage result of 100 random solutions
def average_of_random(amount):
    total = 0
    for _ in range(amount):
        random_sol = random_solution()
        total += fitness(random_sol)         
    return round(total / amount, 3)      
    

print(DF)
print_result(greedy_solution(find_the_best()))
print(average_of_random(100))