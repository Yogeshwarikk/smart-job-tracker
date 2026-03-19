#!/usr/bin/env bash
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
```

**File 2: `backend/Procfile`** (no file extension!)
```
web: gunicorn jobtracker.wsgi --bind 0.0.0.0:$PORT
```

---

## Step 2 — Add gunicorn & whitenoise to requirements.txt

Open `backend/requirements.txt` and make it look like this:
```
Django==4.2.7
djangorestframework==3.14.0
django-cors-headers==4.3.1
djangorestframework-simplejwt==5.4.0
gunicorn==21.2.0
whitenoise==6.6.0
setuptools