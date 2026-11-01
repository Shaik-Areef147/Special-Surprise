"""
WSGI entry point.

PythonAnywhere:  open the Web tab -> WSGI configuration file and paste:

    import sys
    path = '/home/YOUR_USERNAME/birthday-surprise'
    if path not in sys.path:
        sys.path.insert(0, path)
    from app import app as application

Render / Heroku / Railway use:  gunicorn app:app
"""
from app import app as application  # noqa: F401

app = application

if __name__ == "__main__":
    application.run()
