import pandas as pd
import math

def parse_tsp(filename):
    with open(filename, "r") as file:
        lines = file.readlines()
        
    # Start of coordinates
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
    df = pd.DataFrame(data, columns=['x', 'y'])
    return df

def distance_between(x1, x2, y1, y2):
    result = math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
    return round(result, 1)

df = parse_tsp('berlin11.tsp')
print(df)
res = distance_between(df.iloc[0]['x'], df.iloc[1]['x'], df.iloc[0]['y'], df.iloc[1]['y'])
print(res)