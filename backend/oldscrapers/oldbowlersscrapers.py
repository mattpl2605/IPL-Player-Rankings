from bs4 import BeautifulSoup
from collections import defaultdict
from selenium import webdriver
import numpy as np
import pandas as pd
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

driver = webdriver.Chrome(ChromeDriverManager().install())
url = "https://www.espncricinfo.com/records/tournament/bowling-most-wickets-career/indian-premier-league-2023-15129"
driver.get(url)

try:
    # Wait for the page elements to load
    wait = WebDriverWait(driver, 20)

    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.ds-overflow-x-auto")))

    # Extract the page source and parse with BeautifulSoup
    page_source = driver.page_source
    soup = BeautifulSoup(page_source, "html.parser")

    # Find the table containing the Purple Cap data
    table = soup.find("table", {"class": "ds-w-full"})
    rows = table.find_all("tr")[1:]  # Skip the header row

    # Extract data from each row
    data = []
    for row in rows:
        cols = row.find_all("td")
        if cols:
            data_row = {
                "Player": cols[0].text.strip(),
                "Matches": cols[2].text.strip(),
                "Innings": cols[3].text.strip(),
                "Overs Bowled": cols[5].text.strip(),
                "Wickets": cols[8].text.strip(),
                "Bowling Average": cols[10].text.strip(),
                "Economy": cols[11].text.strip(),
                "Bowling Strike Rate": cols[12].text.strip(),
            }
            data.append(data_row)

finally:
    driver.quit()

# Convert data to DataFrame
df = pd.DataFrame(data)

# Save to CSV
df.to_csv("old-purple-cap-ipl-2023.csv")


