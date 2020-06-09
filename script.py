import os
import io
import requests
import pandas as pd 
from sys import stderr

# See the README for how to publish a google sheet as an excel document
df = pd.read_excel('https://docs.google.com/spreadsheets/d/e/2PACX-1vQvX05f1_5V5Y1huTV-4UhsFWqUTPwwVvnRx7O0PRQ_iaqpV1faNDARucSwz0ZlPVRUxAzaJEyGObqw/pub?output=xlsx',
                   sheet_name = "website")

# Explicit renaming of columns 'OldColumnName':'NewColumnName'
df = df.rename(columns = {'Timestamp':'timestamp',
                          'First Name':'first_name',
                          'Last Name':'last_name',
                          'University/Company':'university',
                          'Academia or Industry?':'academic_industry',
                          'Graduate Student Program?':'programs',
                          'Primary Interest/Field':'primary_field',
                          'Secondary Interest/Field':'secondary_field',
                          'Brief description of research done in your lab/company':'short_description',
                          'Latitude':'latitude',
                          'Longitude':'longitude',
                          'Lab Website URL':'website'
})

# Convert timestamp to machine-readable time
df['timestamp'] = pd.to_datetime(df['timestamp'], format="%Y%m%d:%H:%M:%S.%f")

# Sort table by timestamp 
df = df.sort_values(by='timestamp', ascending=True, na_position='first')

# Remove duplicate rows, keep latest entry (detemrined by timestamp) 
df = df[~df.duplicated(subset=['first_name','last_name'], keep='last')]

# Remove rows missing coordinates
df = df[-df['latitude'].isnull()]
df = df[-df['longitude'].isnull()]

# Check if lat and lon are valid
df = df[df['latitude'].between(-90, 90)]
df = df[df['longitude'].between(-180, 180)]

# Convert pandas df to json
newJson = '{"data":' + df.iloc[:,1:].to_json(orient='records', force_ascii=True) + '}'


# Read old json file
with open('./data/gsheet.json', 'r') as myfile:
  currentJson = myfile.read()

# Compare old json and new json, save new json if it's different
# If the two jsons are the same, write to stderr to stop pipeline
if newJson == currentJson:
  stderr.write("Abort deployment, google sheet data hasn't changed")
  
# Save new json if it's different
file='./data/gsheet.json'
if newJson != currentJson: 
  with open(file, 'w') as filetowrite:
      filetowrite.write(newJson)


