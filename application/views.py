from flask import current_app as app, jsonify, request, render_template, send_file
from flask_security import auth_required, roles_required, current_user
from werkzeug.security import check_password_hash
from flask_restful import marshal, fields, reqparse
import flask_excel as excel
from .models import User,db, Song, Role, Album
from .sec import datastore
from .tasks import create_song_csv
from celery.result import AsyncResult
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token,jwt_required,get_jwt_identity
import uuid
from .instances import cache


#---------------home page-----------
@app.get('/')
def home():
    return render_template("index.html")


#--------------user signup endpoint--------------
@app.post('/user-signup')
def user_signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    roles = data.get('roles')
    print("all the roles",roles)
    if "creator" in roles:
        creator=True
        activee = False
    else:
        activee = True
        creator=False
    if not email or not password or not roles:
        return jsonify({"message": "Email, password, or roles not provided"}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 400
    
    hashed_password = generate_password_hash(password)
    fs_uniquifier = str(uuid.uuid4())
    new_user = User(username=username, email=email, password=hashed_password, active=activee, fs_uniquifier=fs_uniquifier, is_creator=creator)
    roles = Role.query.filter(Role.name.in_(roles)).all()
    new_user.roles.extend(roles)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully", "email": new_user.email}), 201


#--------------user login endpoint----------------
@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": "email not provided"}),400
    
    user = datastore.find_user(email=email)

    if not user:
        return jsonify({"message": "User not found"}), 404
    
    if check_password_hash(user.password, data.get("password")):
        return jsonify({"email": user.email, "role": user.roles[0].name, "token": user.get_auth_token(), "active": user.active})
     
    else:
        return jsonify({"message": "Wrong Password"}), 400

user_fields = {
    "id": fields.Integer,
    "email": fields.String,
    "active": fields.Boolean,
    "username": fields.String,
    "is_creator": fields.Boolean
} 


#-----------------users info accessible only by admins--------------
# @cache.cached(timeout=50)
@app.get('/users')
@auth_required("token")
@roles_required("admin")
def all_users():
    users = User.query.all()
    if len(users) == 0:
        return jsonify({"message": "No user found"})
    return marshal(users, user_fields)


#------------------user info--------------
# @cache.cached(timeout=50)
@app.get('/user-info')
@auth_required("token")
def user():
    user = User.query.filter_by(username=current_user.username).all()    
    if len(user) == 0:
        return jsonify({"message": "No user found"})
    return marshal(user, user_fields)


#-------------------lyrics for every song id------------------
@app.get('/lyrics/<int:song_id>')
@auth_required("token")
def lyrics(song_id):
    song = Song.query.get(song_id)
    lyrics = song.lyrics
    if not lyrics:
        return jsonify({"message":"lyrics not found"})
    return jsonify({"id": song.id, "name": song.name, "lyrics": song.lyrics, "message": "lyrics found"})


#------------------activate creator functionality for admin----------------
@app.get('/activate/creator/<int:creator_id>')
@auth_required("token")
@roles_required("admin")
def activate_creator(creator_id):
    creator = User.query.get(creator_id)
    if not creator or "creator" not in creator.roles:
        return jsonify({"message":"Instructor not found"}),404
    
    creator.active=True
    db.session.commit()
    return jsonify({"message":"User Activated"}),200


#-----------------approve song api for admin------------
@app.get('/song/<int:id>/approve')
@auth_required("token")
@roles_required("admin")
def song(id):
    song = Song.query.get(id)
    if not song:
        return jsonify({"message": "Resource Not found"}), 404
    song.is_approved = True
    db.session.commit()
    return jsonify({"message": "Song Approved"})


#----------------approve album api for admin--------------
@app.get('/album/<int:id>/approve')
@auth_required("token")
@roles_required("admin")
def album(id):
    album = Album.query.get(id)
    if not album:
        return jsonify({"message": "Resource Not found"}), 404
    album.is_approved = True
    db.session.commit()
    return jsonify({"message": "Album Approved"})


#------------------reject or flag song api for admin-------------
@app.get('/song/<int:id>/reject')
@auth_required("token")
@roles_required("admin")
def song_reject(id):
    song = Song.query.get(id)
    if not song:
        return jsonify({"message": "Resource Not found"}), 404
    song.is_approved = False
    db.session.commit()
    return jsonify({"message": "Song Flagged"})


#------------------reject or flag album api for admin-------------
@app.get('/album/<int:id>/reject')
@auth_required("token")
@roles_required("admin")
def album_reject(id):
    album = Album.query.get(id)
    if not album:
        return jsonify({"message": "Resource Not found"}), 404
    album.is_approved = False
    db.session.commit()
    return jsonify({"message": "Album Flagged"})


#------------------download csv file------------
@app.get('/download-csv')
def download_csv():
    task = create_song_csv.delay()
    return jsonify({"task-id": task.id})

@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"message": " Pending"}), 404