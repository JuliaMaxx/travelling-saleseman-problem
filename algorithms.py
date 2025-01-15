import math
import time
import random

# Calculate distance between two points
def distance_between(x1, x2, y1, y2):
    return round(math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2), 3)

# Greedy algorithm to find a solution starting from a specific point
def greedy_solution(starting_point, POINTS, socketio):
    remaining_indexes = list(range(len(POINTS)))
    solution = [starting_point]
    
    while len(remaining_indexes) > 1:
        remaining_indexes.remove(starting_point)
        shortest_distance = float('inf')
        next_city = -1
        
        for i in remaining_indexes:
            distance = distance_between(
                POINTS[i]['x'], POINTS[starting_point]['x'],
                POINTS[i]['y'], POINTS[starting_point]['y']
            )
            if distance < shortest_distance:
                shortest_distance = distance
                next_city = i
        
        solution.append(next_city)
        starting_point = next_city
        
        # Emit the current state of the solution to the frontend
        socketio.emit('update_lines', {'solution': solution, 'points': POINTS})
        
        # Sleep for a short amount of time to visualize the progress
        time.sleep(0.01)
        
    solution.append(solution[0])
    socketio.emit('update_lines', {'solution': solution, 'points': POINTS})
    return solution

def random_solution(POINTS, socketio):
   solution = list(range(len(POINTS)))
   random.shuffle(solution)
   
   # Ensure the solution returns to the starting city
   solution.append(solution[0])
   socketio.emit('update_lines', {'solution': solution, 'points': POINTS})
   return solution