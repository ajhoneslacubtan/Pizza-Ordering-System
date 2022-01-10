from flask import jsonify, request
from werkzeug.datastructures import MultiDict
from modules.conndb import spcall
from modules.sales import get_products, sales
from flask_login import login_required

from app import app

@app.route('/api/products/', methods=['POST'])
@login_required
def add_product():
    product_code = request.json['product_code']
    product_name = request.json['product_name']
    product_image = request.json['product_image']
    product_describe = request.json['product_describe']
    price_9in = request.json['price_9in']
    price_12in = request.json['price_12in']
    u_id = request.json['u_id']

    result = spcall("add_product", (product_code, product_name, product_image, product_describe, price_9in, price_12in, u_id), True)
    
    return jsonify(result)

@app.route('/api/products/', methods=['PUT'])
@login_required
def update_product():
    product_code = request.json['product_code']
    product_name = request.json['product_name']
    product_describe = request.json['product_describe']
    product_image = request.json['product_image']
    size = request.json['price_9in']

    result = spcall("update_product", (product_code, product_name, product_describe, product_image, size), True)
    
    return jsonify(result)

@app.route('/api/products/status/', methods=['PUT'])
@login_required
def update_product_status():
    product_code = request.json['product_code']
    u_id  = request.json['u_id']
    product_avail = request.json['product_avail']
    product_size = request.json['product_size']

    result = spcall("update_product_status", (product_code, u_id, product_avail, product_size), True)

    return jsonify(result)

@app.route('/api/products/price/', methods=['PUT'])
@login_required
def update_product_price():
    product_code = request.json['product_code']
    u_id  = request.json['u_id']
    product_size = request.json['product_size']
    product_price = request.json['product_price']

    result = spcall("update_product_price", (product_code, u_id, product_price, product_size), True)

    return jsonify(result)

@app.route('/api/products/', methods=['DELETE'])
@login_required
def delete_product():
    product_code = request.json['product_code']

    result = spcall("delete_product", (product_code,), True)

    return jsonify(result)

@app.route('/api/products/', methods=['GET'])
@login_required
def list_products():
    result = spcall("list_products", ())[0][0]

    return jsonify(result)

@app.route('/api/products/size/<string:product_size>', methods=['GET'])
@login_required
def get_products_by_size(product_size):
    result = spcall("get_products_by_size", (product_size,))[0][0]

    return jsonify(result)

@app.route('/api/products/<string:product_name>', methods=['GET'])
@login_required
def search_product(product_name):
    result = spcall("search_product", (product_name,))[0][0]

    return jsonify(result)

# Orders

@app.route('/api/orders/', methods=['POST'])
@login_required
def add_order():
    order_code = request.json['order_code']
    customer_name = request.json['customer_name']
    total = request.json['total']
    result = spcall("add_order", (order_code, customer_name, total), True)[0][0]

    return jsonify(result)

@app.route('/api/orders/', methods=['GET'])
@login_required
def get_orders():
    result = spcall("get_all_orders", ())[0][0]

    return jsonify(result)

@app.route('/api/sales/', methods=['GET'])
@login_required
def get_all_orders():
    orders = spcall("get_all_orders", ())[0][0]['orders']

    products = get_products(spcall("list_products", ())[0][0])

    orderDetail = spcall("get_all_order_details", ())[0][0]

    result = sales(orders, orderDetail, products)

    return jsonify(result)

@app.route('/api/orders/status/', methods=['PUT'])
@login_required
def update_order_status():
    order_code = request.json['order_code']
    order_status = request.json['order_status']

    result = spcall("update_order_status", (order_code, order_status), True)[0][0]

    return jsonify(result)

@app.route('/api/orders/<string:order_status>', methods=['GET'])
@login_required
def get_list_order_codes(order_status):
    result = spcall("get_list_order_codes", (order_status,))[0][0]

    return jsonify(result)

# Order Details

@app.route('/api/order_details/', methods=['GET'])
@login_required
def get_all_order_details():
    result = spcall("get_all_order_details", ())[0][0]

    return jsonify(result)

@app.route('/api/order_details/', methods=['POST'])
@login_required
def add_order_details():
    order_code = request.json['order_code']
    product_code = request.json['product_code']
    product_size = request.json['product_size']
    product_qty = request.json['product_qty']

    result = spcall("add_order_details", (order_code, product_code, product_size, product_qty), True)[0][0]

    return jsonify(result)

@app.route('/api/order_details/<string:order_code>', methods=['GET'])
@login_required
def get_list_order_details(order_code):
    result = spcall("get_order_details", (order_code,))[0][0]

    return jsonify(result)

@app.route('/api/users/', methods=['GET'])
@login_required
def get_users():
    result = spcall("get_users", ())[0][0]

    return jsonify(result)