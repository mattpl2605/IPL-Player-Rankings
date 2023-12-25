import pandas as pd
from flask import Flask, jsonify, request
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

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

def extract_batter_profile_data(url):
    driver = webdriver.Chrome(ChromeDriverManager().install())
    try:
        driver.get(url)
        driver.implicitly_wait(10)
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # Initialize variables to store player info
        player_description_text = ''
        grid_container_text = None
        batting_stats = []

        # Extract player description
        player_description = soup.find('div', class_='ih-td-text')
        if player_description:
            player_description_text = player_description.get_text(strip=True).replace('\n', '')

        # Extract grid container info
        grid_container = soup.find('div', class_='grid-container')
        if grid_container:
            grid_container_text = ' | '.join([': '.join([item.find('span').get_text(strip=True), item.find('p').get_text(strip=True)]) for item in grid_container.find_all('div', class_='grid-items')])

        # Extract player batting career statistics table
        batting_stats_table = soup.find('div', class_='sm-pp__stats-box')
        if batting_stats_table:
            table = BeautifulSoup(str(batting_stats_table), 'html.parser').find('table')
            if table:
                headers = [th.get_text(strip=True) for th in table.find_all('th')]
                for tr in table.find_all('tr')[1:]:
                    cells = tr.find_all('td')
                    row_data = {headers[i]: cell.get_text(strip=True) for i, cell in enumerate(cells)}
                    if row_data.get('Year') == 'Career':
                        row_data['Career Stats'] = row_data.pop('Year')
                    batting_stats.append(row_data)

        return grid_container_text, player_description_text, batting_stats

    except Exception as e:
        print(f"Error: {e}")
    finally:
        driver.quit()


def extract_bowler_profile_data(url):
    driver = webdriver.Chrome(ChromeDriverManager().install())
    try:
        driver.get(url)
        driver.implicitly_wait(10)
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # Initialize variables to store player info
        player_description_text = ''
        grid_container_text = None
        bowling_stats = []

        # Extract player description
        player_description = soup.find('div', class_='ih-td-text')
        if player_description:
            player_description_text = player_description.get_text(strip=True).replace('\n', '')

        # Extract grid container info
        grid_container = soup.find('div', class_='grid-container')
        if grid_container:
            grid_container_text = ' | '.join([': '.join([item.find('span').get_text(strip=True), item.find('p').get_text(strip=True)]) for item in grid_container.find_all('div', class_='grid-items')])

        # Extract player bowling career statistics table
        bowling_stats_containers = soup.find_all('div', class_='sm-pp__stats-box')
        if bowling_stats_containers and len(bowling_stats_containers) > 1:
            bowling_stats_table = bowling_stats_containers[1]
            table = BeautifulSoup(str(bowling_stats_table), 'html.parser').find('table')
            if table:
                headers = [th.get_text(strip=True) for th in table.find_all('th')]
                for tr in table.find_all('tr')[1:]:
                    cells = tr.find_all('td')
                    row_data = {headers[i]: cell.get_text(strip=True) for i, cell in enumerate(cells)}
                    if row_data.get('Year') == 'Career':
                        row_data['Career Stats'] = row_data.pop('Year')
                    bowling_stats.append(row_data)

        return grid_container_text, player_description_text, bowling_stats

    except Exception as e:
        print(f"Error: {e}")
    finally:
        driver.quit()

@app.route('/get-bowler-profile', methods=['GET'])
def get_bowler_profile():
    bowler_name = request.args.get('name')
    if not bowler_name:
        return jsonify({"error": "No player name provided"}), 400

    # Load CSV and construct player profile URL
    file_path = 'bowlers-ipl-2023.csv'
    df = pd.read_csv(file_path)
    df['ClientPlayerID'] = df['ClientPlayerID'].fillna(0).astype(int)
    df['URL'] = df.apply(lambda row: f"https://www.iplt20.com/teams/{row['TeamID']}/squad-details/{row['ClientPlayerID']}", axis=1)

    bowler_url = df[df['BowlerName'] == bowler_name]['URL'].iloc[0] if df[df['BowlerName'] == bowler_name].shape[0] > 0 else None

    if not bowler_url:
        return jsonify({"error": "Player not found"}), 404

    # Scrape data for the specific player
    grid_container, player_description, bowler_stats = extract_bowler_profile_data(bowler_url)

    return jsonify({
        'bowler_name': bowler_name,
        'url': bowler_url,
        'grid_container': grid_container,
        'player_description': player_description,
        'player_statistics': bowler_stats
    })

@app.route('/get-batter-profile', methods=['GET'])
def get_batter_profile():
    batter_name = request.args.get('name')
    if not batter_name:
        return jsonify({"error": "No player name provided"}), 400

    # Load CSV and construct player profile URL
    file_path = 'batters-ipl-2023.csv'
    df = pd.read_csv(file_path)
    df['ClientPlayerID'] = df['ClientPlayerID'].fillna(0).astype(int)
    df['URL'] = df.apply(lambda row: f"https://www.iplt20.com/teams/{row['TTeamID']}/squad-details/{row['ClientPlayerID']}", axis=1)

    batter_url = df[df['StrikerName'] == batter_name]['URL'].iloc[0] if df[df['StrikerName'] == batter_name].shape[0] > 0 else None

    if not batter_url:
        return jsonify({"error": "Player not found"}), 404

    # Scrape data for the specific player
    grid_container, player_description, batter_stats = extract_batter_profile_data(batter_url)

    return jsonify({
        'batter_name': batter_name,
        'url': batter_url,
        'grid_container': grid_container,
        'player_description': player_description,
        'player_statistics': batter_stats
    })

if __name__ == '__main__':
    app.run(debug=True)



