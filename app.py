import eventlet
eventlet.monkey_patch()

import random
import config
import threading
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from algorithms.greedy_algorithm import greedy_solution
from algorithms.random_algorithm import random_solution, average_of_random
from algorithms.genetic_algorithm import genetic_solution

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="https://travelling-saleseman-problem.onrender.com", async_mode="eventlet")

config.pause_event.set()

@app.route('/')
def home():
    return render_template('index.html')


# Event to send points from backend to frontend
@socketio.on('get_points')
def handle_points(data):
    manual = data['manual']
    num_points = data['numPoints']
    x_min = data['xMin']
    x_max = data['xMax']
    y_max = data['yMax']
    y_min = data['yMin']
    
    if not manual:
        config.POINTS = [{'x': random.randint(x_min, x_max), 'y': random.randint(y_min, y_max)} for _ in range(num_points)]
        emit('receive_points', {'points': config.POINTS})
    else:
        config.POINTS = num_points
        
    
# Event to start the selected algorithm
@socketio.on('start_algorithm')
def start_algorithm(data):
    # Reset control flags
    config.stop_event.clear()
    config.pause_event.set()
    algorithm = data['algorithm']
    # Greedy
    if algorithm == 'greedy':
        greedy_solution(0, socketio, False)
    # Random
    elif algorithm == 'random':
        average_num = data['averageNum']
        if average_num == 1:
            random_solution(socketio)
        else:
            threading.Thread(target=average_of_random, args=(average_num, socketio), daemon=True).start()
    # Genetic        
    elif algorithm == "genetic":
        genetic_solution(
            data['populationSize'],
            data['greedyRatio'],
            data['crossover'],
            data['epochNum'],
            data['mutation'],
            data['mutationProbability'],
            data['selection'],
            data['tournamentSize'],
            data['elite'],
            data['eliteSize'], socketio)    

# Event to pause the algorithm 
@socketio.on('pause_algorithm')
def pause_algorithm(data):
    config.pause_event.clear() 
   
# Event to resume the algorithm 
@socketio.on('resume_algorithm')
def resume_algorithm(data):
    config.pause_event.set()    

# Event to stop the algorithm 
@socketio.on('stop_algorithm')
def stop_algorithm(data):
    config.stop_event.set()
    config.pause_event.set()     
        
# Event to update delay
@socketio.on('update_delay')
def update_delay(data):
        config.VISUALIZATION_DELAY = float(data['delay']) + 0.001

if __name__ == '__main__':
    app.run()