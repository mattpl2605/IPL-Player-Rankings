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

stats = []
web_drive = webdriver.Chrome(ChromeDriverManager().install())
url = "http://www.howstat.com/cricket/Statistics/IPL/PlayerList.asp"
web_drive.get(url)

#selects specific IPL season in list using Select class
select = Select(web_drive.find_element(By.NAME, "cboSeason"))
select.options[16].click()

time = WebDriverWait(web_drive, 10)
time.until(EC.presence_of_element_located((By.TAG_NAME, "body")))

content = web_drive.page_source.encode('utf-8').strip()
soup = BeautifulSoup(content, "html.parser")

#extracts row of player stats
table = soup.find("table", {"class":"TableLined"})
trs = table.find_all("tr")

player_links = []
player_names = []

def def_value():
    return "N/A"

player_stats = defaultdict(def_value)

#iterate over each row and get individual stats
for i in range(1, len(trs)):
    tds = trs[i].find_all("td")
    name = tds[0].text.strip()
    match = tds[2].text.strip()
    runs = tds[3].text.strip()
    batting_avg = tds[4].text.strip()
    wickets = tds[5].text.strip()
    bowling_avg = tds[6].text.strip()

    player_stats = {"Name": name, "Matches": match, "Runs": runs, "Batting Average": batting_avg, "Wicket": wickets, "Bowling Average": bowling_avg}
    stats.append(player_stats)

web_drive.quit()

new_stats = pd.DataFrame.from_dict(stats)
new_stats.to_csv("ipl.csv")