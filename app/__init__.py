from flask import Flask
from settings import DB_URI
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from os.path import join, dirname, realpath

UPLOAD_FOLDER = join(dirname(realpath(__file__)), 'static/uploads/')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__, static_url_path='', static_folder='static', template_folder='templates')

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SECRET_KEY'] = 'secretranatoniha'
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()

db.init_app(app)

login_manager = LoginManager()
login_manager.login_view = 'login'
login_manager.init_app(app)

from .model import Users
@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))


from app import auth
from app import api
from app import views
