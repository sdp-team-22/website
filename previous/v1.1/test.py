import pandas
import json
import re

def clean_data(filename):
    excel_data_df = pandas.read_excel(filename, sheet_name='Indata')

    #only care about the first 17 column of the data
    subset_df = excel_data_df.iloc[:, :17]
    #row by row display 
    thisIsjson = subset_df.to_json(orient='split')
    jsonDict = json.loads(thisIsjson)
    #for fake searching
    res = get_compound_name(jsonDict, filename)

    return [jsonDict, res]

def get_compound_name(jsonDict, filename):
    full_compound_name = jsonDict['data'][15][1]
    compound_name = re.search(r'(\d+)', full_compound_name).group(1)
    return [filename, compound_name]


