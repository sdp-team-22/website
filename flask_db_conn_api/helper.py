import pandas as pd 
import json
import re
import math

"""
def process_files(files):
    file_contents = {}

    for f in files:
        file_content = pd.read_excel(f, sheet_name='Indata').iloc[:, :17].to_json(orient='split')
        file_contents[f.filename] = json.loads(file_content)
        #file_contents.append(json.loads(file_content))
    return file_contents
"""



def file_excel_to_json1(file):
    DATASET_JSON = dict()
    
    excel_df = pd.read_excel(file)

    DATASET_JSON['File Name'] = file.filename
    DATASET_JSON['Project Name'] = excel_df.iloc[8]['Unnamed: 1']
    DATASET_JSON['Scientist Name'] = excel_df.iloc[9]['Unnamed: 1']
    DATASET_JSON['Compound Name'] = excel_df.iloc[15]['Unnamed: 1']
    DATASET_JSON['Solid Form'] = excel_df.iloc[17]['Unnamed: 1']
    DATASET_JSON['Tmelt'] = excel_df.iloc[18]['Unnamed: 1']
    DATASET_JSON['Hfus'] = excel_df.iloc[19]['Unnamed: 1']
    
    SOLUBILITY_DF = excel_df.iloc[26:, :17].copy()
    del excel_df    
    SOLUBILITY_DF.reset_index(drop=True, inplace=True)
    SOLUBILITY_DF.rename(
        columns={
            'Solublity Data Template': SOLUBILITY_DF.iloc[0,0],
            'Unnamed: 1': SOLUBILITY_DF.iloc[0,1],
            'Unnamed: 2': SOLUBILITY_DF.iloc[0,2],
            'Unnamed: 3': str(SOLUBILITY_DF.iloc[0,3]+'_'+SOLUBILITY_DF.iloc[1,3]).replace(" ", ""),
            'Unnamed: 4': str(SOLUBILITY_DF.iloc[0,4]+'_'+SOLUBILITY_DF.iloc[1,4]).replace(" ", ""),
            'Unnamed: 5': str(SOLUBILITY_DF.iloc[0,5]+'_'+SOLUBILITY_DF.iloc[1,5]).replace(" ", ""),
            'Unnamed: 6': SOLUBILITY_DF.iloc[1,6], # T or C?
            'Unnamed: 7': SOLUBILITY_DF.iloc[0,7],
            'Unnamed: 8': SOLUBILITY_DF.iloc[1,8],
            'Unnamed: 9': SOLUBILITY_DF.iloc[1,9],
            'Unnamed: 10': SOLUBILITY_DF.iloc[1,10],
            'Unnamed: 11': SOLUBILITY_DF.iloc[1,11],
            'Unnamed: 12': SOLUBILITY_DF.iloc[0,12],
            'Unnamed: 13': SOLUBILITY_DF.iloc[0,13],
            'Unnamed: 14': SOLUBILITY_DF.iloc[0,14],
            'Unnamed: 15': SOLUBILITY_DF.iloc[0,15],
            'Unnamed: 16': SOLUBILITY_DF.iloc[0,16],
            }, inplace=True)        
    SOLUBILITY_DF.drop(
        index= [0, 1],
        inplace=True
    )
    # display(HTML(SOLUBILITY_DF.head(20).to_html()))
    
    COLUMN_NAME = list(SOLUBILITY_DF.columns) # as they can change per file
        
    SOLUBILITY_DATA = list()
    for row in SOLUBILITY_DF.iterrows(): 
        row = row[1]
        
        data_input_status = str(row[COLUMN_NAME[16]])
        if data_input_status != 'OK':
            continue
        
        solvent_1 = str(row[COLUMN_NAME[0]])
        solvent_2 = str(row[COLUMN_NAME[1]])
        solvent_3 = str(row[COLUMN_NAME[2]])
        """
        perhaps best to redesign this outside loop 
        so not to do condition check each time ran
        """
        # wt-frac or vol-frac
        if 'volfrac' in [frac_col[23:] for frac_col in COLUMN_NAME[3:6]]:
            vol_frac_1 = {'name': 'SolvFrac1_volfrac', 'data': float(row[COLUMN_NAME[3]])}
            vol_frac_2 = {'name': 'SolvFrac2_volfrac', 'data': float(row[COLUMN_NAME[4]])}
            vol_frac_3 = {'name': 'SolvFrac3_volfrac', 'data': float(row[COLUMN_NAME[5]])}
        elif 'wtfrac' in [frac_col[23:] for frac_col in COLUMN_NAME[3:6]]: # !!!
            vol_frac_1 = {'name': 'SolvFrac1_wtfrac', 'data': float(row[COLUMN_NAME[3]])}
            vol_frac_2 = {'name': 'SolvFrac2_wtfrac', 'data': float(row[COLUMN_NAME[4]])}
            vol_frac_3 = {'name': 'SolvFrac3_wtfrac', 'data': float(row[COLUMN_NAME[5]])}
        else:
            raise Exception("Neither \'volfrac\' or \'wtfrac\' are in column names!")
        
        temp_t = float(row[COLUMN_NAME[6]])
        xrpd = str(row[COLUMN_NAME[7]])
        # the Solubility* columns seem to carry there name's over quite well
        # solubility_1 = mg/g solvn. , mg/g solv.  , mg/mL solv.
        # solubility_2 = mg/g solv.  , mg/g soln.  , mg/g solv.
        # solubility_3 = wt %        , wt %        , mg/g soln.
        # solubility_4 = mg/mL solv. , mg/mL solv. , wt%
        solubility_1 = {'name': str(COLUMN_NAME[8]), 'data': float(row[COLUMN_NAME[8]])}
        solubility_2 = {'name': str(COLUMN_NAME[9]), 'data': float(row[COLUMN_NAME[9]])}
        solubility_3 = {'name': str(COLUMN_NAME[10]), 'data': float(row[COLUMN_NAME[10]])}
        solubility_4 = {'name': str(COLUMN_NAME[11]), 'data': float(row[COLUMN_NAME[11]])}
        
        # for convention sake
        solute_lot_num = float(row[COLUMN_NAME[12]])
        if math.isnan(solute_lot_num):
            solute_lot_num = "nan"
        eln_sample_num_measure = float(row[COLUMN_NAME[13]])
        if math.isnan(eln_sample_num_measure):
            eln_sample_num_measure = "nan"
        measure_method = str(row[COLUMN_NAME[14]])
        comments = str(row[COLUMN_NAME[15]])
                
        row_data = {
            'Solvent 1': solvent_1,
            'Solvent 2': solvent_2,
            'Solvent 3': solvent_3,
            vol_frac_1['name']: vol_frac_1['data'],
            vol_frac_2['name']: vol_frac_2['data'],
            vol_frac_3['name']: vol_frac_3['data'],
            'Temp': temp_t,
            'XRPDF': xrpd,
            solubility_1['name']: solubility_1['data'],
            solubility_2['name']: solubility_2['data'],
            solubility_3['name']: solubility_3['data'],
            solubility_4['name']: solubility_4['data'],
            'Solute Lot Number': solute_lot_num,
            'ELN/Sample Number of Measurements': eln_sample_num_measure,
            'Measurement Method': measure_method,
            'Comments': comments,
        }
        SOLUBILITY_DATA.append(row_data)
    
    DATASET_JSON['Row Data'] = SOLUBILITY_DATA
    # print(json.dumps(DATASET_JSON, indent=4))
    # display(HTML(SOLUBILITY_DF.head(20).to_html()))
    return DATASET_JSON

def file_excel_to_json(data, table):
    DATASET_JSON = dict()

    excel_df = pd.DataFrame(data['allData'][table]['data'], columns=data['allData'][table]['columns'])
    
    DATASET_JSON['File Name'] = table
    DATASET_JSON['Project Name'] = excel_df.iloc[8]['Unnamed: 1']
    DATASET_JSON['Scientist Name'] = excel_df.iloc[9]['Unnamed: 1']
    DATASET_JSON['Compound Name'] = excel_df.iloc[15]['Unnamed: 1']
    DATASET_JSON['Solid Form'] = excel_df.iloc[17]['Unnamed: 1']
    DATASET_JSON['Tmelt'] = excel_df.iloc[18]['Unnamed: 1']
    DATASET_JSON['Hfus'] = excel_df.iloc[19]['Unnamed: 1']


    
    SOLUBILITY_DF = excel_df.iloc[26:, :17].copy()
    del excel_df    
    SOLUBILITY_DF.reset_index(drop=True, inplace=True)
    SOLUBILITY_DF.rename(
        columns={
            'Solublity Data Template': SOLUBILITY_DF.iloc[0,0],
            'Unnamed: 1': SOLUBILITY_DF.iloc[0,1],
            'Unnamed: 2': SOLUBILITY_DF.iloc[0,2],
            'Unnamed: 3': str(SOLUBILITY_DF.iloc[0,3]+'_'+SOLUBILITY_DF.iloc[1,3]).replace(" ", ""),
            'Unnamed: 4': str(SOLUBILITY_DF.iloc[0,4]+'_'+SOLUBILITY_DF.iloc[1,4]).replace(" ", ""),
            'Unnamed: 5': str(SOLUBILITY_DF.iloc[0,5]+'_'+SOLUBILITY_DF.iloc[1,5]).replace(" ", ""),
            'Unnamed: 6': SOLUBILITY_DF.iloc[1,6], # T or C?
            'Unnamed: 7': SOLUBILITY_DF.iloc[0,7],
            'Unnamed: 8': SOLUBILITY_DF.iloc[1,8],
            'Unnamed: 9': SOLUBILITY_DF.iloc[1,9],
            'Unnamed: 10': SOLUBILITY_DF.iloc[1,10],
            'Unnamed: 11': SOLUBILITY_DF.iloc[1,11],
            'Unnamed: 12': SOLUBILITY_DF.iloc[0,12],
            'Unnamed: 13': SOLUBILITY_DF.iloc[0,13],
            'Unnamed: 14': SOLUBILITY_DF.iloc[0,14],
            'Unnamed: 15': SOLUBILITY_DF.iloc[0,15],
            'Unnamed: 16': SOLUBILITY_DF.iloc[0,16],
            }, inplace=True)        
    SOLUBILITY_DF.drop(
        index= [0, 1],
        inplace=True
    )
    # display(HTML(SOLUBILITY_DF.head(20).to_html()))
    
    COLUMN_NAME = list(SOLUBILITY_DF.columns) # as they can change per file
        
    SOLUBILITY_DATA = list()
    for row in SOLUBILITY_DF.iterrows(): 
        row = row[1]
        
        data_input_status = str(row[COLUMN_NAME[16]])
        if data_input_status != 'OK':
            continue
        
        solvent_1 = str(row[COLUMN_NAME[0]])
        solvent_2 = str(row[COLUMN_NAME[1]])
        solvent_3 = str(row[COLUMN_NAME[2]])

        if solvent_1 == 'None':
            solvent_1 = 'nan'
        

        if solvent_2 == 'None':
            solvent_2 = 'nan'
        

        if solvent_3 == 'None':
            solvent_3 = 'nan'

        #perhaps best to redesign this outside loop 
        #so not to do condition check each time ran

        # wt-frac or vol-frac
        if 'volfrac' in [frac_col[23:] for frac_col in COLUMN_NAME[3:6]]:
            vol_frac_1 = {'name': 'SolvFrac1_volfrac', 'data': float(row[COLUMN_NAME[3]])}
            vol_frac_2 = {'name': 'SolvFrac2_volfrac', 'data': float(row[COLUMN_NAME[4]])}
            vol_frac_3 = {'name': 'SolvFrac3_volfrac', 'data': float(row[COLUMN_NAME[5]])}
        elif 'wtfrac' in [frac_col[23:] for frac_col in COLUMN_NAME[3:6]]: # !!!
            vol_frac_1 = {'name': 'SolvFrac1_wtfrac', 'data': float(row[COLUMN_NAME[3]])}
            vol_frac_2 = {'name': 'SolvFrac2_wtfrac', 'data': float(row[COLUMN_NAME[4]])}
            vol_frac_3 = {'name': 'SolvFrac3_wtfrac', 'data': float(row[COLUMN_NAME[5]])}
        else:
            raise Exception("Neither \'volfrac\' or \'wtfrac\' are in column names!")


        temp_t = float(row[COLUMN_NAME[6]])
        xrpd = str(row[COLUMN_NAME[7]])
        # the Solubility* columns seem to carry there name's over quite well
        # solubility_1 = mg/g solvn. , mg/g solv.  , mg/mL solv.
        # solubility_2 = mg/g solv.  , mg/g soln.  , mg/g solv.
        # solubility_3 = wt %        , wt %        , mg/g soln.
        # solubility_4 = mg/mL solv. , mg/mL solv. , wt%
        solubility_1 = {'name': str(COLUMN_NAME[8]), 'data': float(row[COLUMN_NAME[8]])}
        solubility_2 = {'name': str(COLUMN_NAME[9]), 'data': float(row[COLUMN_NAME[9]])}
        solubility_3 = {'name': str(COLUMN_NAME[10]), 'data': float(row[COLUMN_NAME[10]])}
        solubility_4 = {'name': str(COLUMN_NAME[11]), 'data': float(row[COLUMN_NAME[11]])}



        # for convention sake
        solute_lot_num = row[COLUMN_NAME[12]]
        if solute_lot_num == None:
            solute_lot_num = "nan"

        eln_sample_num_measure = row[COLUMN_NAME[13]]
        if eln_sample_num_measure == None:
            eln_sample_num_measure = "nan"

        measure_method = str(row[COLUMN_NAME[14]])
        if measure_method == 'None':
            measure_method ="nan"
        comments = str(row[COLUMN_NAME[15]])
        if comments == 'None':
            comments ="nan"
                
        row_data = {
            'Solvent 1': solvent_1,
            'Solvent 2': solvent_2,
            'Solvent 3': solvent_3,
            vol_frac_1['name']: vol_frac_1['data'],
            vol_frac_2['name']: vol_frac_2['data'],
            vol_frac_3['name']: vol_frac_3['data'],
            'Temp': temp_t,
            'XRPDF': xrpd,
            solubility_1['name']: solubility_1['data'],
            solubility_2['name']: solubility_2['data'],
            solubility_3['name']: solubility_3['data'],
            solubility_4['name']: solubility_4['data'],
            'Solute Lot Number': solute_lot_num,
            'ELN/Sample Number of Measurements': eln_sample_num_measure,
            'Measurement Method': measure_method,
            'Comments': comments,
        }
        SOLUBILITY_DATA.append(row_data)
    
    DATASET_JSON['Row Data'] = SOLUBILITY_DATA
    # print(json.dumps(DATASET_JSON, indent=4))
    # display(HTML(SOLUBILITY_DF.head(20).to_html()))
    return DATASET_JSON