from main import app
from application.sec import datastore
from application.models import db, Role
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name="admin", description="User is an admin")
    datastore.find_or_create_role(name="creator", description="User is a creator")
    datastore.find_or_create_role(name="user", description="User is a user")
    db.session.commit()

    if not datastore.find_user(email="amishamishra12886@gmail.com"):
        datastore.create_user(username="amisha", email="amishamishra12886@gmail.com", password=generate_password_hash("admin"), roles=["admin"])
    if not datastore.find_user(email="22f1000938@ds.study.iitm.ac.in"):
        datastore.create_user(username="mahima", email="22f1000938@ds.study.iitm.ac.in", password=generate_password_hash("creator1"), roles=["creator"], active=False, is_creator=True)
    if not datastore.find_user(email="22f1000512@ds.study.iitm.ac.in"):
        datastore.create_user(username="abhinav", email="22f1000512@ds.study.iitm.ac.in", password=generate_password_hash("creator2"), roles=["creator"], active=False, is_creator=True)
    if not datastore.find_user(email="qefri2023@gmail.com"):
        datastore.create_user(username="yuvraj", email="qefri2023@gmail.com", password=generate_password_hash("user1"), roles=["user"])
    if not datastore.find_user(email="revanth12@gmail.com"):
        datastore.create_user(username="revanth", email="revanth12@gmail.com", password=generate_password_hash("user2"), roles=["user"])

    db.session.commit()