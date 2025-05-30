from flask import Flask
from flask import jsonify
from flask import request
from flask import send_from_directory
import os
import json

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
ANNOTATIONS_FILE = 'annotations.json'

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

if not os.path.exists(ANNOTATIONS_FILE):
    with open(ANNOTATIONS_FILE, "r", encoding="utf-8") as file:
        json.load(file)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

app.config["ANNOTATIONS_FILE"] = ANNOTATIONS_FILE

@app.route("/upload", methods=['POST'])
def upload_video():
    if "video" not in request.files:
        return jsonify({"error": "No video file"}), 400

    file = request.files['video']

    if file.filename == '':
        return jsonify({"error": "Video file not selected"}), 400

    filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(filepath)

    return ({"message": "Video upload successful!","filename": file.filename}), 200

@app.route("/videos", methods=['GET'])
def list_videos():
    files = os.listdir(app.config['UPLOAD_FOLDER'])
    return jsonify({"videos": files})

@app.route("/videos/<filename>", methods=['GET'])
def get_video(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

def load_annotations():
    if not os.path.exists(ANNOTATIONS_FILE):
        return {}
    with open(ANNOTATIONS_FILE, "r", encoding="utf-8") as file:
        return json.load(file)
    
def save_annotations(data):
    with open(ANNOTATIONS_FILE, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=2)

@app.route("/annotations/<video_id>", methods=['POST'])
def add_annotations(video_id):
    data = request.json
    timestamp = data.get("timestamp")
    text = data.get("text")
    style = data.get("style", {})

    if timestamp is None or not text:
        return jsonify({"error": "Timestamp and text are required"}), 400

    annotations = load_annotations()
    if video_id not in annotations:
        annotations[video_id] = []

    annotations[video_id].append({"timestamp": timestamp, "text": text, "style": style})
    save_annotations(annotations)

    return jsonify({"message": "Annotation added", "annotation": data})

@app.route("/annotations/<video_id>", methods=["GET"])
def get_annotations(video_id):
    annotations = load_annotations()
    return jsonify(annotations.get(video_id, []))


if __name__ == "__main__":
    app.run(debug=True)