from flask import Flask
from flask_security import Security
from application.models import db, User, Role
from config import DevelopmentConfig
from application.resources import api
from application.sec import datastore
from application.worker import celery_init_app
from celery.schedules import crontab
import flask_excel as excel
from application.tasks import daily_reminder, monthly_report
from flask_jwt_extended import JWTManager
from application.instances import cache

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    excel.init_excel(app)
    app.config['JWT_SECRET_KEY'] = 'your_secret_key_here'
    app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']
    jwt = JWTManager(app)
    app.security = Security(app, datastore)
    cache.init_app(app)
    with app.app_context():
        import application.views
    return app

app = create_app()
celery_app = celery_init_app(app)

@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=13, minute=30),
        daily_reminder.s('ameeee@gmail.com','Listen to your favourite songs'),
    )
    sender.add_periodic_task(
        crontab(hour=4, minute=25, day_of_month=17),
        monthly_report.s('ameeee@gmail.com','This is your monthly report'),
    )
 

if __name__ == '__main__':
    app.run(debug=True) 