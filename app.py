"""
Birthday Surprise  -  Flask application
Run locally :  python app.py          -> http://127.0.0.1:5000
Production  :  gunicorn app:app       (Render / Railway / Heroku)
PythonAnywhere uses wsgi.py (see README.md)
"""
import os

from flask import Flask, render_template, request, url_for, jsonify

import config

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
IMAGE_DIR = os.path.join(BASE_DIR, "static", "images")
AUDIO_DIR = os.path.join(BASE_DIR, "static", "audio")

app = Flask(__name__)


def _clean(value, default, limit=40):
    """Trim and limit user supplied text (names come from the URL)."""
    value = (value or "").strip()
    return value[:limit] if value else default


def _substitute(obj, name, sender):
    """Replace {name} / {sender} in every string of the TEXT config."""
    if isinstance(obj, str):
        return obj.replace("{name}", name).replace("{sender}", sender)
    if isinstance(obj, list):
        return [_substitute(i, name, sender) for i in obj]
    if isinstance(obj, dict):
        return {k: _substitute(v, name, sender) for k, v in obj.items()}
    return obj


def _photo_url(filename):
    """URL of a photo, falling back to a placeholder if the file is missing."""
    if filename and os.path.isfile(os.path.join(IMAGE_DIR, filename)):
        return url_for("static", filename=f"images/{filename}")
    return url_for("static", filename="images/placeholder.svg")


def _music_url():
    name = getattr(config, "MUSIC_FILE", "")
    if name and os.path.isfile(os.path.join(AUDIO_DIR, name)):
        return url_for("static", filename=f"audio/{name}")
    return None


@app.route("/")
def index():
    name = _clean(request.args.get("name"), config.NAME)
    sender = _clean(request.args.get("from"), config.SENDER)

    t = _substitute(config.TEXT, name, sender)
    photos = {key: _photo_url(fn) for key, fn in config.PHOTOS.items()}

    # the letter is typed out by JavaScript, so we hand it over as JSON
    letter = [{"cls": "l-title", "text": t["letter_title"]}]
    letter += [{"cls": "l-body", "text": p} for p in t["letter_body"]]
    letter += [{"cls": "l-sign", "text": t["letter_sign"]}]

    js_config = {
        "letter": letter,
        "music": _music_url(),
        "rotate": bool(config.ROTATE_ON_PORTRAIT),
    }

    return render_template(
        "index.html",
        name=name,
        sender=sender,
        page_title=_substitute(config.PAGE_TITLE, name, sender),
        t=t,
        photos=photos,
        js_config=js_config,
    )


@app.route("/healthz")
def healthz():
    return jsonify(status="ok")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_DEBUG") == "1")
