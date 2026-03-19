from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

# Re-register with default UserAdmin (already registered, but explicit is clear)
# No customisation needed — Django's built-in UserAdmin handles everything.
