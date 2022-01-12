import re
from flask import render_template, request, redirect, url_for, flash, Markup
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_login import login_user, login_required, logout_user, current_user
from .model import Users
import os
from . import db

from app import app, ALLOWED_EXTENSIONS

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/users/', methods=['POST'])
@login_required
def add_user():
    # code to validate and add user to database goes here
    username = request.form.get('username')
    password = request.form.get('password')
    user_role = request.form.get('role')

    user = Users.query.filter_by(user_name=username).first() # if this returns a user, then the email already exists in database

    if user: # if a user is found, we want to redirect back to signup page so user can try again
        message = Markup('<span id="alert-body" class="closebtn" onclick="this.parentElement.style.display='+ "`none`"+ ';">&times;</span>Username already exists!')
        flash(message)
        return redirect(url_for('users'))

    # check if the post request has the file part
    if 'file' not in request.files:
        message = Markup('<span id="alert-body" class="closebtn" onclick="this.parentElement.style.display='+ "`none`"+ ';">&times;</span>Please attach an image!')
        flash(message)
        return redirect('users')

    file = request.files['file']
    # If the user does not select a file, the browser submits an
    # empty file without a filename

    if file.filename == '':
        message = Markup('<span id="alert-body" class="closebtn" onclick="this.parentElement.style.display='+ "`none`"+ ';">&times;</span>No selected file!')
        flash(message)
        return redirect('users')

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(path)

        # create a new user with the form data. Hash the password so the plaintext version isn't saved.
        new_user = Users(user_name=username,user_pass=generate_password_hash(password, method='sha256'), user_role=user_role, user_image='/uploads/'+filename)

        # add the new user to the database
        db.session.add(new_user)
        db.session.commit()
        
        return redirect(url_for('users'))

@app.route('/changepassword/', methods=['POST'])
@login_required
def change_password():
    # code to validate and add user to database goes here
    password = request.form.get('curpassword')

    # check if the password is valid
    if not check_password_hash(current_user.user_pass, password):
        message = Markup('<span id="alert-body" class="closebtn" onclick="this.parentElement.style.display='+ "`none`"+ ';">&times;</span>Invalid password!')
        flash(message)
        return redirect(url_for('changepassword'))

    if request.form.get('newpassword') != request.form.get('confirmpassword'):
        message = Markup('<span id="alert-body" class="closebtn" onclick="this.parentElement.style.display='+ "`none`"+ ';">&times;</span>Passwords do not match!')
        flash(message)
        return redirect(url_for('changepassword'))

    # create a new user with the form data. Hash the password so the plaintext version isn't saved.
    current_user.user_pass = generate_password_hash(request.form.get('newpassword'), method='sha256')

    # add the new user to the database
    db.session.commit()
    
    return redirect(url_for('index'))

@app.route('/login')
def login():
    return render_template('public/login.html')

@app.route('/login', methods=['POST'])
def login_post():
    username = request.form.get('username')
    password = request.form.get('password')
    remember = True if request.form.get('remember') == 'on' else False

    user = Users.query.filter_by(user_name=username).first()
    
    if not user or not check_password_hash(user.user_pass, password):
        message = Markup('<span id="alert-body" class="closebtn" onclick="this.parentElement.style.display='+ "`none`"+ ';">&times;</span>Please check your login details and try again.')
        flash(message)
        return redirect(url_for('login'))

    login_user(user, remember=remember)
    return redirect(url_for('index'))

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))