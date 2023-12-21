import pandas as pd

file_path = 'purple-cap-ipl-2023.csv'
data = pd.read_csv(file_path)

def calculate_bowler_rating(wickets, average, economy, strike_rate):
    return wickets * ((wickets / average) + (wickets / strike_rate)) * (1 / economy)

data['Bowler Rating'] = data.apply(
    lambda row: calculate_bowler_rating(
        row['Wickets'],
        row['Bowling Average'],
        row['Economy'],
        row['Bowling Strike Rate']
    ),
    axis=1
)

data['Adjusted Bowler Rating'] = data['Bowler Rating'] * 7

top_15 = data[['Player', 'Matches', 'Wickets', 'Bowling Average', 'Economy', 'Bowling Strike Rate', 'Adjusted Bowler Rating']].sort_values(by='Adjusted Bowler Rating', ascending=False).head(15)
print(top_15)