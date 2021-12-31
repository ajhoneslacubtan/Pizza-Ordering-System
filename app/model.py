from flask_login import UserMixin
from . import db

class Users(UserMixin, db.Model):
    user_id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
    user_name = db.Column(db.String(100), unique=True)
    user_pass = db.Column(db.String(100))
    user_role = db.Column(db.String(1000))
    user_image = db.Column(db.String(1000))

    def get_id(self):
           return (self.user_id)