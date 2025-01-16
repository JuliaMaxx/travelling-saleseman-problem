from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import random
from algorithms import greedy_solution, random_solution, average_of_random, genetic

app = Flask(__name__)
socketio = SocketIO(app)

POINTS = []

@app.route('/')
def home():
    return render_template('index.html')

# Event to send points from backend to frontend
@socketio.on('get_points')
def handle_points(data):
    num_points = data['numPoints']
    global POINTS
    POINTS = [{'x': random.randint(50, 1150), 'y': random.randint(50, 650)} for _ in range(num_points)]
    emit('receive_points', {'points': POINTS})
    
# Event to start the selected algorithm
@socketio.on('start_algorithm')
def start_greedy_algorithm(data):
    algorithm = data['algorithm']
    if algorithm == 'greedy':
        greedy_solution(0, POINTS, socketio)
    elif algorithm == 'random':
        average_num = data['averageNum']
        if average_num == 1:
            random_solution(POINTS, socketio)
        else:
            average_of_random(average_num, POINTS, socketio)
    elif algorithm == "genetic":
        population_size = data['populationSize']
        greedy_ratio = data['greedyRatio']
        selection = data['selection']
        tournament_size = data['tournamentSize']
        elitism = data['elite']
        elite_size = data['eliteSize']
        crossover = data['crossover']
        mutation = data['mutation']
        mutation_probability = data['mutationProbability']
        number_of_epochs = data['epochNum']
        genetic(population_size, greedy_ratio, crossover, number_of_epochs, mutation, mutation_probability, selection, tournament_size, elitism, elite_size, POINTS, socketio)            

if __name__ == '__main__':
    app.run(debug=True)