import pandas as pd

# Load the CSV file
file_path = 'bowlers-ipl-2023.csv'  # Replace with your CSV file path
data = pd.read_csv(file_path)

# Normalizing the Wickets, Economy Rate, Bowling Average, and Bowling Strike Rate
# Note: Lower values for Economy Rate, Bowling Average, and Bowling Strike Rate are better, hence the inversion in normalization
data['NormalizedWickets'] = (data['Wickets'] - data['Wickets'].min()) / (data['Wickets'].max() - data['Wickets'].min())
data['NormalizedEconomyRate'] = 1 - (data['EconomyRate'] - data['EconomyRate'].min()) / (data['EconomyRate'].max() - data['EconomyRate'].min())
data['NormalizedBowlingAverage'] = 1 - (data['BowlingAverage'] - data['BowlingAverage'].min()) / (data['BowlingAverage'].max() - data['BowlingAverage'].min())
data['NormalizedStrikeRate'] = 1 - (data['StrikeRate'] - data['StrikeRate'].min()) / (data['StrikeRate'].max() - data['StrikeRate'].min())

# New weights as per user specification
w_wkts = 0.40  # Most important
w_econ = 0.30  # Second most important
w_sr = 0.20    # Third most important
w_avg = 0.10   # Least important

# Calculating the Rating with new weights
data['BowlerRating'] = (w_wkts * data['NormalizedWickets'] +
                        w_econ * data['NormalizedEconomyRate'] +
                        w_sr * data['NormalizedStrikeRate'] +
                        w_avg * data['NormalizedBowlingAverage']) * 100

# Sorting to get the top 20 ratings
top_20_bowlers = data[['BowlerName', 'Wickets', 'EconomyRate', 'BowlingAverage', 'StrikeRate', 'BowlerRating']].sort_values(by='BowlerRating', ascending=False).head(20)
print(top_20_bowlers)
