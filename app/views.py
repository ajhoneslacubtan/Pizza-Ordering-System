import re
from flask import request, render_template
from flask_login import login_required, current_user

from app import app

@app.route('/')
@login_required
def index():
    return render_template('admin/index.html', user_name=current_user.user_name, user_role=current_user.user_role, user_image=current_user.user_image)

@app.route('/sales/')
@login_required
def sales():
    return render_template('admin/sales.html', user_name=current_user.user_name, user_role=current_user.user_role, user_image=current_user.user_image)

@app.route('/users/')
@login_required
def users():
    return render_template('admin/users.html', user_name=current_user.user_name, user_role=current_user.user_role, user_image=current_user.user_image)

@app.route('/changepassword/')
@login_required
def changepassword():
    return render_template('admin/changepassword.html', user_name=current_user.user_name, user_role=current_user.user_role, user_image=current_user.user_image)

@app.route('/addorders/')
@login_required
def add_order_page():
    return render_template('admin/add-order.html', user_name=current_user.user_name, user_role=current_user.user_role, user_image=current_user.user_image)

@app.route('/products_page/')
@login_required
def products_page():
    return render_template('admin/products.html', user_name=current_user.user_name, user_role=current_user.user_role, user_image=current_user.user_image)

@app.route('/add_products_page/')
@login_required
def add_products_page():
    return render_template('admin/Add-product.html', user_name=current_user.user_name, user_role=current_user.user_role, user_image=current_user.user_image)



@app.after_request
def add_cors(resp):
    resp.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
    resp.headers['Access-Control-Allow-Credentials'] = True
    resp.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS, GET, PUT, DELETE'
    resp.headers['Access-Control-Allow-Headers'] = request.headers.get('Access-Control-Request-Headers',
                                                                             'Authorization')
    # set low for debugging

    if app.debug:
        resp.headers["Access-Control-Max-Age"] = '1'
    return resp


# if __name__ == '__main__':
#     app.debug=True
#     app.run(host=API_HOST, port=API_PORT)