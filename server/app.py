from flask import Flask
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


import os
import linecache
from random import randint
from pathlib import Path, PurePosixPath
from flask import render_template, request, jsonify
from assessment import pronunciation_assessment_continuous_from_file


movie_line_global = ""
uploads_dir = os.path.join(app.instance_path, 'uploads')
speech_filename = "speech.wav"


def get_movie_line():
    line_id, movie_id, character_name, movie_line = ([''] * 4)

    # select a line with 5-15 words
    while len(movie_line.split(' ')) < 5 or len(movie_line.split(' ')) > 25:
        # 307413 lines in total
        line_num = randint(1, 307413)
        random_line = linecache.getline('static/cornell_movie-dialogs_corpus/movie_lines.txt', line_num).strip()
        fields = random_line.split(' +++$+++ ')
        line_id, movie_id, character_name, movie_line = fields[0], fields[2], fields[3], fields[4]

    global movie_line_global
    movie_line_global = movie_line
    return {"line_id": line_id, "movie_id": movie_id, "character_name": character_name, "movie_line": movie_line}


def get_movie_title_from_id(movie_id):
    with open('static/cornell_movie-dialogs_corpus/movie_titles_metadata.txt') as file:
        lines = file.readlines()
        for line in lines:
            fields = line.split(' +++$+++ ')
            if fields[0].strip() == movie_id:
                return fields[1].strip()

    return ""


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html', movie_line=get_movie_line())


@app.route('/line', methods=['GET'])
def line():
    movie_line = get_movie_line()
    title = get_movie_title_from_id(movie_line["movie_id"])
    movie_line["movie_title"] = title
    return jsonify(movie_line)


@app.route('/results', methods=['GET'])
def results():
    return 'results'


@app.route('/assess', methods=['POST'])
def upload_file():
    speech_file = request.files['file']
    speech_file_path = os.path.join(uploads_dir, speech_filename)
    speech_file.save(speech_file_path)

    return pronunciation_assessment_continuous_from_file(speech_file_path, movie_line_global)
