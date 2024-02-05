from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/handle_click', methods=['POST'])
def handle_click():
    print("Button Clicked!")
    return 'Button Clicked!'

if __name__=='__main__':
    app.run(debug=True)