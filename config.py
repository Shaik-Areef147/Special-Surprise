"""
=====================================================================
  BIRTHDAY SURPRISE  -  CONFIGURATION FILE
  Everything you want to change lives in THIS file.
=====================================================================

1.  NAME      -> the birthday person's name (shown on many slides)
2.  PHOTOS    -> file names of your pictures (put them in static/images/)
3.  TEXT      -> every sentence on every slide
4.  MUSIC     -> optional background song (put it in static/audio/)

Use {name} anywhere inside a text and it is replaced by the name.
Use {sender} to insert YOUR name.

You can also personalise a link WITHOUT editing code:
    https://your-site.onrender.com/?name=Rahul&from=Areef
"""
import os

# ---------------------------------------------------------------
# 1. NAMES
# ---------------------------------------------------------------
NAME = os.environ.get("BIRTHDAY_NAME", "Your Name")      # <- CHANGE ME
SENDER = os.environ.get("BIRTHDAY_SENDER", "Me")         # <- CHANGE ME (your name)

# Browser-tab title
PAGE_TITLE = "Happy Birthday {name}!"

# ---------------------------------------------------------------
# 2. PHOTOS  (files inside static/images/)
#    Replace the placeholder images with your own using the SAME file
#    names, OR put new files in static/images/ and change the names
#    below.  jpg / jpeg / png / webp / gif all work.  Any size works
#    (photos are automatically cropped to fit the frame).
# ---------------------------------------------------------------
PHOTOS = {
    "intro":     "intro.jpg",      # Slide 1  - big photo on the first page
    "letter_1":  "letter_1.jpg",   # Gift 1   - letter page, top photo
    "letter_2":  "letter_2.jpg",   # Gift 1   - letter page, bottom photo
    "film_1":    "film_1.jpg",     # Gift 2   - film strip, photo 1
    "film_2":    "film_2.jpg",     # Gift 2   - film strip, photo 2
    "film_3":    "film_3.jpg",     # Gift 2   - film strip, photo 3
    "journal_1": "journal_1.jpg",  # Gift 3   - journal, square photo
    "journal_2": "journal_2.jpg",  # Gift 3   - journal, round photo
}

# ---------------------------------------------------------------
# 3. MUSIC (optional)
#    Drop an mp3 into static/audio/ and put its file name here.
#    Leave as "" for no music. Plays after the first tap.
# ---------------------------------------------------------------
MUSIC_FILE = "music.mp3"

# On a phone held upright the whole page turns sideways so it fills the
# screen (the design is landscape). Set False to disable.
ROTATE_ON_PORTRAIT = True

# ---------------------------------------------------------------
# 4. TEXT
# ---------------------------------------------------------------
TEXT = {
    # ---- Slide 1 : intro ----
    "intro_tag": "MY BOY",                 # small tag on the photo (e.g. MY LOVE)
    "intro_hint": "tap anywhere to open your surprise ✨",

    # ---- Slide 2 : candles ----
    "candles_title": "Blow out the Candles !!!",
    "candles_hint": "Click on the cake",

    # ---- Slide 3 : yay ----
    "yay_title": "Yay!! Happy Birthdayyy",
    "yay_sub": "{name}",
    "yay_button": "Continue",

    # ---- Slide 4 : accept gifts ----
    "accept_title": "Accept your gifts?",
    "accept_yes": "YES",
    "accept_no": "NO",

    # ---- Slide 5 : try again ----
    "retry_title": "Please try again",
    "retry_button": "OKAY",

    # ---- Slide 6 : choose a gift ----
    "gifts_title": "Yay! Choose your gift",
    "gift_1": "Gift 1",
    "gift_2": "Gift 2",
    "gift_3": "Gift 3",
    "back": "← Back",

    # ---- Gift 1 : the letter (typed out letter-by-letter) ----
    "letter_title": "My Dearest {name},",
    "letter_body": [
        "I have been trying to find the right words to tell you how much "
        "you mean to me, and I keep coming back to the simplest truth: "
        "you make my ordinary days feel extraordinary.",

        "I love the way you laugh at your own jokes before you even finish "
        "telling them. I love how you always know exactly what to say when "
        "I am having a rough day.",

        "Thank you for being my favourite person to talk to, to be quiet "
        "with, and to build memories alongside. Every day with you feels "
        "like a gift I did not know I needed.",

        "I cannot wait to see what we create together — more memories, "
        "more inside jokes, more quiet Sunday mornings and loud, happy nights.",
    ],
    "letter_sign": "Forever yours,\n{sender}",

    # ---- Gift 2 : flowers ----
    "flowers_title": "Some flowers for you!!",

    # ---- Gift 3 : journal ----
    "journal_note": "The world is a little brighter because you're in it.",
    "journal_label": "you are the main character",
    "journal_tag": "Birthday Boy",
    "journal_ribbon": "You have a way of making ordinary moments feel special.",
    "journal_body": (
        "Happy birthday to the one who makes my world brighter. "
        "I don't say it enough, but I'm endlessly grateful for your "
        "kindness, your strength, and the way you love me so effortlessly. "
        "Watching you grow, chase your dreams and stay true to yourself "
        "inspires me every single day. I hope this new year brings you "
        "success, peace and all the joy you give so freely to others. "
        "Thank you for being exactly who you are. "
        "Happy birthday, my love."
    ),
}
