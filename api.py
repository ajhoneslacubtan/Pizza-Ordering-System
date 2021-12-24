from flask import Flask, jsonify, request
from modules.conndb import spcall
# from flask_httpauth import HTTPBasicAuth
from settings import API_HOST, API_PORT
import flask

app = Flask(__name__)
# auth = HTTPBasicAuth()

# @auth.get_password
# def get_password(username):
#     return spcall("get_password", (username,))[0][0]

# Products

@app.route('/api/products/', methods=['POST'])
def add_product():
    product_code = request.json['product_code']
    product_name = request.json['product_name']
    product_image = request.json['product_image']
    product_describe = request.json['product_describe']
    price_9in = request.json['price_9in']
    price_12in = request.json['price_12in']
    u_id = request.json['u_id']

    result = spcall("add_product", (product_code, product_name, product_image, product_describe, price_9in, price_12in, u_id))
    
    return jsonify(result)

@app.route('/api/products/', methods=['PUT'])
def update_product():
    product_code = request.json['product_code']
    product_name = request.json['product_name']
    product_describe = request.json['product_describe']
    product_image = request.json['product_image']
    size = request.json['price_9in']

    result = spcall("update_product", (product_code, product_name, product_describe, product_image, size))
    
    return jsonify(result)

@app.route('/api/products/status/', methods=['PUT'])
def update_product_status():
    product_code = request.json['product_code']
    u_id  = request.json['u_id']
    product_avail = request.json['product_avail']
    product_size = request.json['product_size']

    result = spcall("update_product_status", (product_code, u_id, product_avail, product_size))

    return jsonify(result)

@app.route('/api/products/price/', methods=['PUT'])
def update_product_price():
    product_code = request.json['product_code']
    u_id  = request.json['u_id']
    product_size = request.json['product_size']
    product_price = request.json['product_price']

    result = spcall("update_product_price", (product_code, u_id, product_price, product_size))

    return jsonify(result)

@app.route('/api/products/<string:product_code>', methods=['DELETE'])
def delete_product(product_code):

    result = spcall("delete_product", (product_code,))

    return jsonify(result)

@app.route('/api/products/', methods=['GET'])
def list_products():
    result = spcall("list_products", ())[0][0]

    return jsonify(result)

@app.route('/api/products/size/<string:product_size>', methods=['GET'])
def get_products_by_size(product_size):
    result = spcall("get_products_by_size", (product_size,))[0][0]

    return jsonify(result)

@app.route('/api/products/<string:product_name>', methods=['GET'])
def search_product(product_name):
    result = spcall("search_product", (product_name,))[0][0]

    return jsonify(result)

# Orders

@app.route('/api/orders/', methods=['POST'])
def add_order():
    order_code = request.json['order_code']
    customer_name = request.json['customer_name']
    total = request.json['total']
    result = spcall("add_order", (order_code, customer_name, total))

    return jsonify(result)



@app.route('/api/orders/<string:order_code>/status/<string:order_status>', methods=['POST'])
def update_order_status(order_code, order_status):
    result = spcall("update_order_status", (order_code, order_status))

    return jsonify(result)

@app.route('/api/orders/<string:order_status>', methods=['GET'])
def get_list_order_codes(order_status):
    result = spcall("get_list_order_codes", (order_status,))[0][0]

    return jsonify(result)

# Order Details

@app.route('/api/order_details/', methods=['POST'])
def add_order_details():
    order_code = request.json['order_code']
    product_code = request.json['product_code']
    product_size = request.json['product_size']
    product_qty = request.json['product_qty']

    result = spcall("add_order_details", (order_code, product_code, product_size, product_qty))

    return jsonify(result)

@app.route('/api/order_details/<string:order_code>', methods=['GET'])
def get_list_order_details(order_code):
    result = spcall("get_list_order_details", (order_code,))[0][0]

    return jsonify(result)

# Users

@app.route('/api/users/', methods=['POST'])
def add_user():
    u_id = request.json['u_id']
    u_password = request.json['u_password']
    u_role = request.json['u_role']
    u_image = request.json['u_image']

    result = spcall("add_user", (u_id, u_password, u_role, u_image))

    return jsonify(result)

@app.route('/api/users/<string:u_id>', methods=['DELETE'])
def remove_user(u_id):
    result = spcall("remove_user", (u_id,))

    return jsonify(result)

@app.route('/api/users/', methods=['POST'])
def change_password():
    u_id = request.json['u_id']
    u_password = request.json['u_password']

    result = spcall("change_password", (u_id, u_password))

    return jsonify(result)


@app.after_request
def add_cors(resp):
    resp.headers['Access-Control-Allow-Origin'] = flask.request.headers.get('Origin', '*')
    resp.headers['Access-Control-Allow-Credentials'] = True
    resp.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS, GET, PUT, DELETE'
    resp.headers['Access-Control-Allow-Headers'] = flask.request.headers.get('Access-Control-Request-Headers',
                                                                             'Authorization')
    # set low for debugging

    if app.debug:
        resp.headers["Access-Control-Max-Age"] = '1'
    return resp


if __name__ == '__main__':
    app.debug=True
    app.run(host=API_HOST, port=API_PORT)