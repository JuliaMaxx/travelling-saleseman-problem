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
    remaining_indexes = INDEXES.copy()
    
    # Add starting point as the fist city in the solution
    solution = [starting_point]
    
    while len(remaining_indexes) > 1:
        remaining_indexes.remove(starting_point)   
        shortest_distance = float('inf')
        next_city = -1
        
        # Calculate what is the closest city to the current one
        for i in remaining_indexes:
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

# Genetic algorithm
def initial_population(size, greedy_ratio):
    population = []
    
    # How many there should be of greedy and random solutions
    size_greedy = int(size * greedy_ratio)
    size_random = size - size_greedy
    
    for _ in range(size_greedy):
        starting_point = random.choice(INDEXES)
        population.append(greedy_solution(starting_point))
        
    for _ in range(size_random):
        population.append(random_solution())
        
    random.shuffle(population)
    return population

def population_info(population):
    size = len(population)
    # Find the best, worst and average distance
    best_distance =  float('inf')
    worst_distance =  float('-inf')
    total_distance = 0
    for solution in population:
        distance = fitness(solution)
        total_distance += distance
        if distance < best_distance:
            best_distance = distance
        if distance > worst_distance:
            worst_distance = distance
    average_distance = round(total_distance / size, 3)
    print(f"Population size: {size}")
    print(f"Best distance: {best_distance}")
    print(f"Worst distance: {worst_distance}")
    print(f"Average distance: {average_distance}")
    
def tournament(population, tournament_size):
    # Take a random sample out of population 
    contestants = random.sample(population, tournament_size)
    
    best_distance = float("inf")
    winner = []
    
    # Determine the best one out of the sample
    for contestant in contestants:
       distance = fitness(contestant)
       if  distance < best_distance:
           best_distance = distance
           winner = contestant
    return winner 

def elite_selection(population, elite_size):
    elite = []
    for solution in population:
        solution_fitness = fitness(solution)
        
        # If there is no initial elite
        if len(elite) < elite_size:
            elite.append((solution, solution_fitness))
        else:
            # Find the worst solution currently in elite
            longest_in_elite = max(elite, key=lambda x:x[1])
            
            # If current solution is better than the one in elite - replace it
            if solution_fitness < longest_in_elite[1]:
                index_of_longest = elite.index(longest_in_elite)
                elite[index_of_longest] = (solution, solution_fitness)
                
    # return only solutions with no distances
    return [x[0] for x in elite]

def roulette_selection(population):
    # Calculate fitness for each solution
    distances = [fitness(solution) for solution in population]
    distance_of_all = sum(distances)
    
    # Calculate relative distance for each solution
    relative_distances = [distance / distance_of_all for distance in distances]
    
    # Calclucalte cumulative distances aka divide the wheel into segments
    cumulative_distances = [sum(relative_distances[:i+1]) for i in range(len(relative_distances))]
    
    rand = random.random()
    for i, cd in enumerate(cumulative_distances):
        if rand <= cd:
            return population[i]

def ordered_crossover(parent1,  parent2):
    # Remove last city since it's the same as the first
    parent1 = parent1[:-1]
    parent2 = parent2[:-1]
    
    # Make a list of the same size as parents
    offspring = [None] * len(parent1)
    
    # Take a random slice from parent 1
    start_position = random.randint(0, len(parent1) - 1)
    end_position = random.randint(0, len(parent1) - 1)
    if start_position > end_position:
        start_position, end_position = end_position, start_position
    sub_parent1 = parent1[start_position:end_position]
    
    # Take all the numbers from parent 2 that were not taken yet
    sub_parent2 = [x for x in parent2 if x not in sub_parent1]
    
    # Set numbers from parent 1 in the same position in offspring
    offspring[start_position:end_position] = sub_parent1
    
    # Fill up all the gaps with numbers from parent 2
    index = 0
    for i in range(len(offspring)):
        if offspring[i] is None:
            if index < len(sub_parent2):
                offspring[i] = sub_parent2[index] 
                index += 1 
                
    offspring.append(offspring[0])
    return offspring

def mutation(mutation_probability, child):
    solution = child.copy()
    if random.random() <= mutation_probability:
        # Get two random cities in the solution
        first_city_index = random.randint(1, len(solution) - 2)
        second_city_index = random.randint(1, len(solution) - 2)
        first_city = solution[first_city_index]
        second_city = solution[second_city_index]
        
        # Swap those two cities places
        solution[first_city_index] = second_city
        solution[second_city_index] = first_city
    return solution

def create_n_epochs(initial_population, number_of_epochs, mutation_probability, roulette, tournament_size, elitism, elite_size):
    n = 1
    population = initial_population
    print(f"Epoch {n}")
    population_info(population)
    
    while n < number_of_epochs:
        new_population = []
        if elitism:
            elite = elite_selection(population, elite_size)
            new_population.extend(elite)
        while len(new_population) < len(population):
            # Select parents
            parent1, parent2 = None, None
            while parent1 == parent2:
                if roulette:
                    parent1 = roulette_selection(population)
                    parent2 = roulette_selection(population)
                else:
                    parent1 = tournament(population, tournament_size)
                    parent2 = tournament(population, tournament_size)
            
            # Perform crossover
            child = ordered_crossover(parent1, parent2)
            
            # Apply mutation
            mutated_child = mutation(mutation_probability, child)
            
            # Add to the new population
            if mutated_child not in new_population:
                new_population.append(mutated_child)
        
        # Update for the next epoch
        population = new_population
        n += 1
        print(f"\nEpoch {n}")
        population_info(population)
    return population



population = initial_population(50, 0.2)
last_population = create_n_epochs(population, 10, 0.2, True, 5, True, 2)