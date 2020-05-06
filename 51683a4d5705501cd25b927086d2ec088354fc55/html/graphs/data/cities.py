from opencage.geocoder import OpenCageGeocode
from pprint import pprint
import pandas as pd

key = 'c4a64efe0b9b4888b58b8f9f4e8d020e'
geocoder = OpenCageGeocode(key)

list_lat = []   # create empty lists

list_long = []

df = pd.read_csv("state_drugs.csv")

for index, row in df.iterrows(): # iterate over rows in dataframe


    State = row['BUYER_STATE']
    query = str(State)

    results = geocoder.geocode(query)
    lat = results[0]['geometry']['lat']
    long = results[0]['geometry']['lng']

    list_lat.append(lat)
    list_long.append(long)


# create new columns from lists

df['lat'] = list_lat

df['lon'] = list_long

df.to_csv("state_drugs_coord.csv")
