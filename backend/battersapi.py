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
url = "https://www.iplt20.com/stats/2023"
driver.get(url)

try:
    # Wait for the page elements to load
    wait = WebDriverWait(driver, 20)

    # Click on the stats type filter (if necessary)
    stats_type_filter = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "statsTypeFilter")))
    stats_type_filter.click()

    # Click on the Orange Cap section
    orange_cap = wait.until(EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'cSBListItems') and contains(text(), 'Orange Cap')]")))
    orange_cap.click()

    view_all_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "div.np-mostrunsTab__btn a")))
    driver.execute_script("arguments[0].scrollIntoView(true);", view_all_button)

    # Use JavaScript to click if normal click fails
    try:
        view_all_button.click()
    except:
        driver.execute_script("arguments[0].click();", view_all_button)

    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.np-mostrunsTable")))

    # Extract the page source and parse with BeautifulSoup
    page_source = driver.page_source
    soup = BeautifulSoup(page_source, "html.parser")

    # Find the table containing the Orange Cap data
    table = soup.find("table", {"class": "statsTable"})
    rows = table.find_all("tr")[1:]  # Skip the header row

    # Extract data from each row
    data = []
    for row in rows:
        cols = row.find_all("td")
        if cols:
            data_row = {
                "Player": cols[1].text.strip(),
                "Matches": cols[2].text.strip(),
                "Innings": cols[3].text.strip(),
                "Runs": cols[5].text.strip(),
                "Batting Average": cols[7].text.strip(),
                "Batting Strike Rate": cols[9].text.strip(),
                # Add other columns as necessary
            }
            data.append(data_row)

finally:
    driver.quit()

# Convert data to DataFrame
df = pd.DataFrame(data)

# Save to CSV
df.to_csv("orange-cap-ipl-2023.csv")


