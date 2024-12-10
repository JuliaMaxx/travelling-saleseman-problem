import pandas as pd

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

df = parse_tsp('kroA100.tsp')
print(df)