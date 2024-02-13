from flask import Flask,render_template,request
from test import clean_data
import os

RECENT_FILENAME = None

app = Flask(__name__)
location = "static/temp_files"
file_uploaded = []

@app.route('/')
def main():
    return render_template("index.html")

@app.route('/input_data')
def display():
    return render_template("input_data.html")


@app.route('/view_table', methods = ['POST'])
def success():
    if request.method == 'POST' and 'file' in request.files:
        f = request.files['file']
        file_path = os.path.join(location, f.filename)
        f.save(file_path)
        global RECENT_FILENAME
        RECENT_FILENAME = file_path
        file_uploaded.append(f.filename)
        data_dict = clean_data(file_path)

        # Check if data retrieval was successful
        if data_dict is not None:
            return render_template("table.html", json_data=data_dict)

    return "Error"

@app.route('/upload_cancel', methods=['POST'])
def upload_cancel():
    if request.method == 'POST':
        if 'cancel' in request.form:
            os.remove(RECENT_FILENAME)
        return render_template("index.html")
    if 'upload' in request.form:
        return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True)

