import json
import pandas as pd
import requests

url = 'https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds/stats/107-toprunsscorers.js?callback=ontoprunsscorers&_=1703267057845'

# Perform the GET request
response = requests.get(url)
data = response.text

# Extract JSON information from the JavaScript callback
start = data.find('(') + 1
end = data.rfind(')')
json_data = data[start:end]
parsed_data = json.loads(json_data)

# Convert JSON to DataFrame
df = pd.DataFrame(parsed_data)

# Proces each row to convert JSON-like strings into dictionaries
converted_rows = [row for row in df[df.columns[0]]]

# Create a new DataFrame from the converted data
converted_df = pd.DataFrame(converted_rows)

# Save the new DataFrame as a CSV file
converted_df.to_csv("batters-ipl-2023.csv", index=False)
