import pandas as pd
from flask import Flask, jsonify

app = Flask(__name__)

#Filepath to Purple Cap CSV file
bowler_path = 'bowlers-ipl-2023.csv'

#Filepath to Orange Cap CSV file
batter_path = 'batters-ipl-2023.csv'

#Normalize all statistics
def normalize_column(column):
    return column / column.max()


# Bowling weights for each statistic
w_wkts = 0.40
w_econ = 0.30
w_sr = 0.20
w_avg = 0.10

# Batting weights for each statistic
runs_weight = 0.43
strike_rate_weight = 0.34
batting_average_weight = 0.23

#Function to calculate bowler ratings
def calculate_bowler_rating(wkts, norm_wkts, norm_econ, norm_avg, norm_sr, wkts_wt, econ_wt, avg_wt, sr_wt):
    if wkts < 5:
        wkts_wt *= 0.5
        econ_wt *= 0.5
        avg_wt *= 0.5
        sr_wt * 0.5
    rating = (wkts_wt * norm_wkts + econ_wt * norm_econ + avg_wt * norm_avg + sr_wt * norm_sr)
    return 100 * rating

#Function to calculate batter ratings
def calculate_batter_rating(runs, norm_runs, norm_strike_rate, norm_avg, runs_wt, sr_wt, avg_wt, threshold, reduced_weight_factor):
    if runs < threshold:
        return 100 * (runs_wt * norm_runs * reduced_weight_factor + sr_wt * norm_strike_rate * reduced_weight_factor + avg_wt * norm_avg * reduced_weight_factor)
    else:
        return 100 * (runs_wt * norm_runs + sr_wt * norm_strike_rate + avg_wt * norm_avg)

@app.route('/get-bowler-ratings', methods=['GET'])
def get_bowler_ratings():
    data = pd.read_csv(bowler_path)


    #Calculate the normalized values for each statistic
    data['Normalized Wickets'] = (data['Wickets'] - data['Wickets'].min()) / (data['Wickets'].max() - data['Wickets'].min())
    data['Normalized Economy'] = 1 - (data['EconomyRate'] - data['EconomyRate'].min()) / (data['EconomyRate'].max() - data['EconomyRate'].min())
    data['Normalized Bowling Average'] = 1 - (data['BowlingAverage'] - data['BowlingAverage'].min()) / (data['BowlingAverage'].max() - data['BowlingAverage'].min())
    data['Normalized Bowling Strike Rate'] = 1 - (data['BowlingSR'] - data['BowlingSR'].min()) / (data['BowlingSR'].max() - data['BowlingSR'].min())

    # Calculate the Bowler Rating with the new weights
    data['Bowler Rating'] = data.apply(
        lambda row: calculate_bowler_rating(
            row['Wickets'],
            row['Normalized Wickets'],
            row['Normalized Economy'],
            row['Normalized Bowling Average'],
            row['Normalized Bowling Strike Rate'],
            w_wkts,
            w_econ,
            w_avg,
            w_sr
        ),
        axis=1
    )

    # Calculate the rank for each bowler
    data['Rank'] = data['Bowler Rating'].rank(ascending=False, method='min')

    # Sort DataFrame by the rank
    sorted_data = data.sort_values(by='Rank', ascending=True)

    return jsonify(sorted_data.to_dict(orient='records'))

@app.route('/get-batter-ratings', methods=['GET'])
def get_batter_ratings():
    data = pd.read_csv(batter_path)

    # Convert all statistics to numbers
    data['TotalRuns'] = pd.to_numeric(data['TotalRuns'], errors='coerce')
    data['StrikeRate'] = pd.to_numeric(data['StrikeRate'], errors='coerce')
    data['BattingAverage'] = pd.to_numeric(data['BattingAverage'], errors='coerce')

    #Replace NaN in the Batting Average column with values from the Runs column
    data['BattingAverage'].fillna(data['TotalRuns'], inplace = True)

    # Replace NaN in the Batting Average column with values from the Runs column
    data['BattingAveragesss'].fillna(data['TotalRuns'], inplace=True)

    # Filter out rows where ClientPlayerID is NaN
    data = data.dropna(subset=['ClientPlayerID'])

    #Normalize all statistics
    data['Normalized Runs'] = normalize_column(data['TotalRuns'])
    data['Normalized Batting Average'] = normalize_column(data['BattingAverage'])
    data['Normalized Strike Rate'] = normalize_column(data['StrikeRate'])

    # Calculate the Batter Rating with the new weights
    data['Batter Rating'] = data.apply(
        lambda row: calculate_batter_rating(
            row['TotalRuns'],
            row['Normalized Runs'],
            row['Normalized Strike Rate'],
            row['Normalized Batting Average'],
            runs_weight,
            strike_rate_weight,
            batting_average_weight,
            100,
            0.5
        ),
        axis=1
    )

    #Calculate the rank for each batter
    data['Rank'] = data['Batter Rating'].rank(ascending=False, method='min')

    #Sort DataFrame by the rank
    sorted_data = data.sort_values(by='Rank', ascending=True)

    return jsonify(sorted_data.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)



