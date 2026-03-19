#!/usr/bin/env bash
set -o errexit
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
```

---

## Fix 2 — Update `requirements.txt`

Open `backend/requirements.txt` and make sure it looks **exactly** like this:
```
Django==4.2.7
djangorestframework==3.14.0
django-cors-headers==4.3.1
djangorestframework-simplejwt==5.4.0
gunicorn==21.2.0
whitenoise==6.6.0
setuptools
```

---

## Fix 3 — Create `Procfile` correctly

In VS Code, in the `backend/` folder, create a file named exactly `Procfile` (no extension, capital P).

Contents:
```
web: gunicorn jobtracker.wsgi --bind 0.0.0.0:$PORT