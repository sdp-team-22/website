import psycopg2
import logging


def advanced_search_clean_up(data):
    res = "WHERE"
    print(data)
    for key in data.keys():
        tempList = data.get(key,[])
        if len(res) > 5:
            res += " AND"

        if tempList[0] = "Project Number":
            res += f" project_name = '{tempList[1].lower().strip()}'"
        
        elif tempList[0] == "Molecular Weight" and len(tempList) == 3:
            res += f" molecular_weight {tempList[1].lower().strip()} '{tempList[2].lower().strip()}'"

        elif tempList[0] == "Solid Form" and len(tempList) == 2:
            res += f" solid_form = '{tempList[1].lower().strip()}'"

        elif tempList[0] == "Melting Temperature" and len(tempList) == 3:
            res += f" tmelt {tempList[1].lower().strip()} '{tempList[2].lower().strip()}'"
        
        elif tempList[0] == "Fusion Enthalpy" and len(tempList) == 3:
            res += f" hfus {tempList[1].lower().strip()} '{tempList[2].lower().strip()}'"

        elif tempList[0] == "Solvent":
            if tempList[1] == 'has specific solvent combination':
                solvent_size = len(tempList) - 1
                for i in range(1,solvent_size):
                #if current element is empty we skip
                if len(tempList[i+1]) == 0:
                    continue

                if len(res) > 5 and i != 0:
                    res += " AND"
                
                res += f" solvent_{i} = '{tempList[i+1].lower().strip()}'"

            elif tempList[1] == 'has any data on solvent':
                res += f" solvent_1 = '{tempList[2].lower().strip()}' OR solvent_2 = '{tempList[2].lower().strip()}' OR solvent_3 = '{tempList[2].lower().strip()}'"

        return res
        
def normal_search_clean_up(data):
    if not data:  
        return "" 
    else:
        key, value = data.popitem()  
        return f"WHERE project_name = '{value}'" 

    

def database_search(data):
    dic = data.get('Data', {})
    res = ""
    if dic == {}:
        res = normal_search_clean_up(data)
    else:
        res = advanced_search_clean_up(dic)
    
    print(res)
    

    string = (f"""
        SELECT s.file_name, s.project_name, s.scientist_name, s.compound_name, s.molecular_weight, s.solid_form, s.tmelt, s.hfus, s.solvent_1, s.solvent_2, s.solvent_3
        FROM solubility_data as s
        {res}
            """)

    conn = psycopg2.connect(
        database="postgres",
        user="sdp-dev",
        password="sdp123",
        host="24.62.166.59",
        port="5432"
    )
    cur = conn.cursor()

    cur.execute(string)
    search_result = cur.fetchall()

    cur.close()
    conn.close()

    return search_result



def database_stats():
    conn = psycopg2.connect(
        database="postgres",
        user="sdp-dev",
        password="sdp123",
        host="24.62.166.59",
        port="5432"
    )
    cur = conn.cursor()
    # make multiple queries as needed
    cur.execute("SELECT pg_size_pretty(pg_database_size('postgres')) AS size") 
    db_storage = cur.fetchone()[0]

    # Fetch user upload history
    cur.execute("""
        SELECT  f.id, f.compound_name, u.username, f.time_uploaded
        FROM filestore f
        JOIN users u ON f.owner_id = u.id
        ORDER BY f.time_uploaded DESC
    """)
    upload_history = cur.fetchall()

    # Fetch daily visits
    cur.execute("""
        SELECT DATE_TRUNC('day', f.time_uploaded) AS day, u.id AS user_id, u.username, COUNT(*) AS daily_visits
        FROM filestore f
        JOIN users u ON f.owner_id = u.id
        GROUP BY day, u.id, u.username
        ORDER BY day
    """)
    daily_visits = cur.fetchall()

    # Fetch monthly visits
    cur.execute("""
        SELECT DATE_TRUNC('month', f.time_uploaded) AS month, u.id AS user_id, u.username, COUNT(*) AS monthly_visits
        FROM filestore f
        JOIN users u ON f.owner_id = u.id
        GROUP BY month, u.id, u.username
        ORDER BY month
    """)
    monthly_visits = cur.fetchall()

    cur.close()
    conn.close()

    return db_storage, upload_history, daily_visits, monthly_visits