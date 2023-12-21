import pandas as pd
from flask import Flask, jsonify

app = Flask(__name__)

#Filepath to Purple Cap CSV file
purple_path = 'purple-cap-ipl-2023.csv'

#Filepath to Orange Cap CSV file
orange_path = 'orange-cap-ipl-2023.csv'


#Function that calculates maximum values
def max_column(column):
    return column.max()

#Normalize all statistics
def normalize_column(column):
    return column / column.max()


# Bowling weights for each statistic
w_wkts = 0.40
w_econ = 0.25
w_avg = 0.20
w_sr = 0.15

# Batting weights for each statistic
runs_weight = 0.43
strike_rate_weight = 0.34
batting_average_weight = 0.23

#Function to calculate bowler ratings
def calculate_bowler_rating(wkts, econ, avg, sr, m_wkts, m_econ, m_avg, m_sr, wkts_wt, econ_wt, avg_wt, sr_wt):
    if wkts < 5:
        wkts_wt *= 0.5
        econ_wt *= 0.5
        avg_wt *= 0.5
        sr_wt * 0.5
    rating = ((wkts / m_wkts) * wkts_wt) + ((1 - (econ / m_econ)) * econ_wt) + ((1 - (avg / m_avg)) * avg_wt) + ((1 - (sr / m_sr)) * sr_wt)
    return 100 * rating

#Function to calculate batter ratings
def calculate_batter_rating(runs, norm_runs, norm_strike_rate, norm_avg, runs_wt, sr_wt, avg_wt, threshold, reduced_weight_factor):
    if runs < threshold:
        return 100 * (runs_wt * norm_runs * reduced_weight_factor + sr_wt * norm_strike_rate * reduced_weight_factor + avg_wt * norm_avg * reduced_weight_factor)
    else:
        return 100 * (runs_wt * norm_runs + sr_wt * norm_strike_rate + avg_wt * norm_avg)

@app.route('/get-bowler-ratings', methods=['GET'])
def get_bowler_ratings():
    data = pd.read_csv(purple_path)

    #Calculate the maximum values for each statistic
    data['Max Wickets'] = max_column(data['Wickets'])
    data['Max Economy'] = max_column(data['Economy'])
    data['Max Bowling Average'] = max_column(data['Bowling Average'])
    data['Max Bowling Strike Rate'] = max_column(data['Bowling Strike Rate'])

    # Calculate the Bowler Rating with the new weights
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

    #Sort in descending order
    data.sort_values(by='Bowler Rating', ascending=False, inplace=True)

    return jsonify(data.to_dict(orient='records'))

@app.route('/get-batter-ratings', methods=['GET'])
def get_batter_ratings():
    data = pd.read_csv(orange_path)

    data['Runs'] = pd.to_numeric(data['Runs'], errors='coerce')
    data['Batting Strike Rate'] = pd.to_numeric(data['Batting Strike Rate'], errors='coerce')
    data['Batting Average'] = pd.to_numeric(data['Batting Average'], errors='coerce')

    #Replace NaN in the Batting Average column with values from the Runs column
    data['Batting Average'].fillna(data['Runs'], inplace = True)

    #Normalize all statistics
    data['Normalized Runs'] = normalize_column(data['Runs'])
    data['Normalized Batting Average'] = normalize_column(data['Batting Average'])
    data['Normalized Strike Rate'] = normalize_column(data['Batting Strike Rate'])

    # Calculate the Batter Rating with the new weights
    data['Batter Rating'] = data.apply(
        lambda row: calculate_batter_rating(
            row['Runs'],
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

    # Sort in descending order
    data.sort_values(by='Batter Rating', ascending=False, inplace=True)

    return jsonify(data.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)



