from flask import Flask, request, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/pages/page2')
def page2():
    return render_template('pages/page2.html')

@app.route('/handle_click', methods=['POST'])
def handle_click():
    print("Button Clicked!")
    return 'Button Clicked!'

@app.route('/handle_input', methods=['Post'])
def handle_input():
    # handle files
    files = request.files.getlist('files')
    count = 0
    for file in files:
        print(file.filename)
        count += 1
    return f"{count} Files uploaded successfully"

if __name__=='__main__':
    # open file at http://127.0.0.1:5000
    app.run(debug=True)
    
# 61000, 62000, 63000