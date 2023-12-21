import pandas as pd

file_path = 'orange-cap-ipl-2023.csv'
data = pd.read_csv(file_path)

data['Batting Average'] = pd.to_numeric(data['Batting Average'], errors='coerce')

#Normalize all statistics
def normalize_column(column):
    return column / column.max()

data['Normalized Runs'] = normalize_column(data['Runs'])
data['Normalized Batting Average'] = normalize_column(data['Batting Average'])
data['Normalized Strike Rate'] = normalize_column(data['Batting Strike Rate'])

# Increased weight to runs, then strike rate, then average
runs_weight = 0.43
strike_rate_weight = 0.34
batting_average_weight = 0.23

#Function to calculate batter ratings
def calculate_batter_rating(norm_runs, norm_strike_rate, norm_avg, runs_wt, sr_wt, avg_wt):
    return 100 * (runs_wt * norm_runs + sr_wt * norm_strike_rate + avg_wt * norm_avg)

#Calculate the Batter Rating with the new weights
data['Batter Rating (New Weights)'] = data.apply(
    lambda row: calculate_batter_rating(
        row['Normalized Runs'],
        row['Normalized Strike Rate'],
        row['Normalized Batting Average'],
        runs_weight,
        strike_rate_weight,
        batting_average_weight
    ),
    axis=1
)

top_15 = data[['Player', 'Runs', 'Batting Average', 'Batting Strike Rate', 'Batter Rating (New Weights)']].sort_values(by='Batter Rating (New Weights)', ascending=False).head(15)
print(top_15)
