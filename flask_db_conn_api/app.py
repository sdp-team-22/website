from flask import Flask, jsonify, request
from helper import file_excel_to_json1
from flask_cors import CORS
import psycopg2
import logging

app = Flask(__name__)
CORS(app)

def database_storage():
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

    cur.execute("""
       SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    """)
    tables = cur.fetchone()[0]


    cur.close()
    conn.close()

    return db_storage, tables

@app.route('/api/db_storage')
def api_db_storage():
    db_storage = database_storage()

    return jsonify(db_storage)

@app.route('/api/upload', methods=['GET', 'POST'])
def api_upload():
    if 'files' not in request.files:
        return jsonify({'error': 'No files part'})

    uploaded_files = request.files.getlist('files')

    data = []
    for f in uploaded_files:
        data.append(file_excel_to_json1(f))

    return jsonify(data)
   

    

    filenames = []
    for file in uploaded_files:
        if file.filename == '':
            return jsonify({'error': 'No selected file'})
        filenames.append(file.filename)

    return jsonify({'message': 'Files uploaded successfully', 'filenames': filenames})


if __name__ == '__main__':
    app.run(debug=True)
