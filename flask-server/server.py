from flask import Flask
from flask import jsonify
from flask import request
from flask import send_from_directory
import os

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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

if __name__ == "__main__":
    app.run(debug=True)