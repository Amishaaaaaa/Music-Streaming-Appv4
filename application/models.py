from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer(), db.ForeignKey('role.id'))


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=False)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    is_creator = db.Column(db.Boolean(), default=False)
    roles = db.relationship('Role', secondary='roles_users', 
                            backref=db.backref('users', lazy='dynamic'))
    song = db.relationship('Song', backref='creator')


class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))


class Song(db.Model):
    id = db.Column(db.Integer, autoincrement = True, primary_key = True)
    name = db.Column(db.String, nullable = False, unique = True)
    artist_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)
    genre = db.Column(db.String, unique = False, nullable = False)
    duration = db.Column(db.String, unique = False, nullable = False)
    lyrics = db.Column(db.String, nullable = False)
    date_added = db.Column(db.String, unique = False, nullable = False)
    is_approved = db.Column(db.Boolean(), default = False)
    album_id = db.Column(db.Integer, db.ForeignKey('album.id'), nullable = True)

class Album(db.Model):
    __tablename__ = 'album'
    id = db.Column(db.Integer, autoincrement = True, primary_key = True)
    name = db.Column(db.String, nullable = False, unique = True)
    artist_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)
    is_approved = db.Column(db.Boolean(), default = False)
    release_date = db.Column(db.String)

class Playlist(db.Model):
    id = db.Column(db.Integer, autoincrement = True, primary_key = True)
    name = db.Column(db.String, nullable = False, unique = True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'))

class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    song_id = db.Column(db.Integer, db.ForeignKey('song.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)


