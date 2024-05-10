Steps to download and run in local machine:
- Download the Zip file
- Extract and download the dependencies using pip install -r requirements.txt either in virtual environment or globally.
- Open terminal and run python upload_initial_data.py followed by python main.py
- Go to localhost:5000
- Open ubuntu terminal and run redis-server
- Open another ubuntu terminal and run "celery -A main:celery_app worker --loglevel INFO" and in another "celery -A main:celery_app beat --loglevel INFO"
- For the mail service, run "~/go/bin/MailHog" and go to localhost:8025. Make sure you have mailhog installed using https://github.com/mailhog/MailHog
- With this, the application is ready to run on your machine.
