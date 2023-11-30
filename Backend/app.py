from flask import Flask, jsonify, render_template, request
import json

app = Flask(__name__)

@app.route('/api/burgers', methods=['GET'])
def get_burgers():
    with open('burgers.json', 'r') as file:
        burgers = json.load(file)
    return jsonify(burgers)

@app.route('/api/order', methods=['POST'])
def place_order():
    order = request.json
    with open('burgers.json', 'r+') as file:
        burgers = json.load(file)
        for burger in burgers:
            if burger['id'] == order['burger_id']:
                if burger['stock'] >= order['quantity']:
                    burger['stock'] -= order['quantity']
                    file.seek(0)
                    json.dump(burgers, file, indent=4)
                    file.truncate()
                    return jsonify({'message': 'Order placed successfully.'})
                else:
                    return jsonify({'message': 'Insufficient stock.'})
    return jsonify({'message': 'Burger not found.'})

if __name__ == '__main__':
    app.run(debug=True)