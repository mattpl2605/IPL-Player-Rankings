from flask import Flask, jsonify, request
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import pandas as pd

app = Flask(__name__)

def extract_profile_data(url):
    driver = webdriver.Chrome(ChromeDriverManager().install())
    try:
        driver.get(url)
        driver.implicitly_wait(10)
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # Extract and process player description and grid container
        player_description = soup.find('div', class_='ih-td-text')
        player_description_text = player_description.get_text(strip=True) if player_description else None
        grid_container = soup.find('div', class_='grid-container')
        grid_container_text = ' | '.join([': '.join([item.find('span').get_text(strip=True), item.find('p').get_text(strip=True)]) for item in grid_container.find_all('div', class_='grid-items')]) if grid_container else None

        # Extract and process player batting career statistics table
        batting_stats_table = soup.find('div', class_='sm-pp__stats-box')
        batting_stats = []
        if batting_stats_table:
            table = BeautifulSoup(str(batting_stats_table), 'html.parser').find('table')
            headers = [th.get_text(strip=True) for th in table.find_all('th')]
            for tr in table.find_all('tr')[1:]:
                cells = tr.find_all('td')
                row_data = {headers[i]: cell.get_text(strip=True) for i, cell in enumerate(cells)}
                batting_stats.append(row_data)

        return grid_container_text, player_description_text, batting_stats

    except Exception as e:
        print(f"Error: {e}")
    finally:
        driver.quit()

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
    grid_container, player_description, batter_stats = extract_profile_data(batter_url)

    return jsonify({
        'batter_name': batter_name,
        'url': batter_url,
        'grid_container': grid_container,
        'player_description': player_description,
        'player_statistics': batter_stats
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)