from celery import shared_task
from .models import Song
import flask_excel as excel
from .mail_service import send_message
from .models import User,Role
from jinja2 import Template
from flask_excel import make_response_from_query_sets
from flask import render_template
import os



@shared_task(ignore_result=False)
def create_song_csv():
    song = Song.query.all()
    csv_output = excel.make_response_from_query_sets(song, ['id','name','artist_id','genre','duration','lyrics','date_added', 'is_approved','album_id'], "csv", filename="song1.csv")
    filename="song.csv"

    with open(filename, 'wb') as f:
        f.write(csv_output.data)
    
    return filename


@shared_task(ignore_result=True)
def daily_reminder(to, subject):
    users = User.query.filter(User.roles.any(Role.name=='user')).all()
    for user in users:
        send_message(user.email, subject, "Listen to all new trendy songs only on sunoMusic. Visit the app now!")
    return "OK"


@shared_task(ignore_result=True)
def monthly_report(to, subject):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    html_file_path = os.path.join(current_dir, 'test.html')
    users = User.query.filter(User.roles.any(Role.name=='creator')).all()
    songs = Song.query.with_entities(Song.date_added, Song.name, Song.lyrics).all()
    for user in users:
        with open(html_file_path, 'r') as f:
            template = Template(f.read())
            list=[]
            for song in songs:
                list.append(song.name)
            send_message(user.email, subject, template.render(email=user.email, list=list))
    return "OK"

