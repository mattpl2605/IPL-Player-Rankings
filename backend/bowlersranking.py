import pandas as pd

file_path = 'purple-cap-ipl-2023.csv'
data = pd.read_csv(file_path)

#Calculate the maximum values for each statistic
def max_column(column):
    return column.max()

data['Max Wickets'] = data['Wickets'].max()
data['Max Economy'] = data['Economy'].max()
data['Max Bowling Average'] = data['Bowling Average'].max()
data['Max Bowling Strike Rate'] = data['Bowling Strike Rate'].max()

w_wkts = 0.40
w_econ = 0.25
w_avg = 0.20
w_sr = 0.15
def calculate_bowler_rating(wkts, econ, avg, sr, m_wkts, m_econ, m_avg, m_sr, wkts_wt, econ_wt, avg_wt, sr_wt):
    rating = ((wkts / m_wkts) * wkts_wt) + ((1 - (econ / m_econ)) * econ_wt) + ((1 - (avg / m_avg)) * avg_wt) + ((1 - (sr / m_sr)) * sr_wt)
    return 100 * rating


data['Bowler Rating'] = data.apply(
    lambda row: calculate_bowler_rating(
        row['Wickets'],
        row['Economy'],
        row['Bowling Average'],
        row['Bowling Strike Rate'],
        row['Max Wickets'],
        row['Max Economy'],
        row['Max Bowling Average'],
        row['Max Bowling Strike Rate'],
        w_wkts,
        w_econ,
        w_avg,
        w_sr
    ),
    axis=1
)

top_15 = data[['Player', 'Matches', 'Wickets', 'Bowling Average', 'Economy', 'Bowling Strike Rate', 'Bowler Rating']].sort_values(by='Bowler Rating', ascending=False).head(15)
print(top_15)