from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import random
from algorithms import greedy_solution, random_solution, average_of_random, genetic
import config

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def home():
    return render_template('index.html')

# Event to send points from backend to frontend
@socketio.on('get_points')
def handle_points(data):
    num_points = data['numPoints']
    config.POINTS = [{'x': random.randint(50, 1150), 'y': random.randint(50, 650)} for _ in range(num_points)]
    emit('receive_points', {'points': config.POINTS})
    
# Event to start the selected algorithm
@socketio.on('start_algorithm')
def start_greedy_algorithm(data):
    algorithm = data['algorithm']
    # Greedy
    if algorithm == 'greedy':
        greedy_solution(0, socketio)
    # Random
    elif algorithm == 'random':
        average_num = data['averageNum']
        if average_num == 1:
            random_solution(socketio)
        else:
            average_of_random(average_num, socketio)
    # Genetic        
    elif algorithm == "genetic":
        genetic(
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
        
@socketio.on('update_delay')
def update_delay(data):
        config.VISUALIZATION_DELAY = data['delay'] 

if __name__ == '__main__':
    app.run(debug=True)