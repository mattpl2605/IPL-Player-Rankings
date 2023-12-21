import pandas as pd

file_path = 'orange-cap-ipl-2023.csv'
data = pd.read_csv(file_path)

data['Batting Average'] = pd.to_numeric(data['Batting Average'], errors='coerce')

#Normalize all statistics
max_runs = data['Runs'].max()
max_average = data['Batting Average'].max()
max_strike_rate = data['Batting Strike Rate'].max()

data['Normalized Runs'] = data['Runs'] / max_runs
data['Normalized Batting Average'] = data['Batting Average'] / max_average
data['Normalized Strike Rate'] = data['Batting Strike Rate'] / max_strike_rate

# Increased weight to runs, then strike rate, then average
runs_weight = 0.43
strike_rate_weight = 0.34
batting_average_weight = 0.23

#Calculate the Batter Rating with the new weights
data['Batter Rating (New Weights)'] = (runs_weight * data['Normalized Runs'] + strike_rate_weight * data['Normalized Strike Rate']
                                       + batting_average_weight * data['Normalized Batting Average'])

#Multiply it by 100 for scaling issues
data['Batter Rating (New Weights)'] *= 100

top_15 = data[['Player', 'Runs', 'Batting Average', 'Batting Strike Rate', 'Batter Rating (New Weights)']].sort_values(by='Batter Rating (New Weights)', ascending=False).head(15)
print(top_15)
