import React, {useState, useEffect} from 'react'
import './App.css'

function App() {

    const [videoFile, setVideoFile] = useState(null);
    const [videoURL, setVideoURL] = useState('');
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState("");
    const [currentPage, setCurrentPage] = useState("home");


    useEffect(() => {

        fetchVideos();

    }, []);

    const fetchVideos = () => {
        fetch("/videos")
            .then(res => res.json())
            .then(data => {
                console.log("Fetched Videos", data);
                if (Array.isArray(data.videos)) {
                    setVideos(data.videos);
                }
                else {
                    setVideos([]);
                }
            })
        .catch(error => {
            console.error("Error fetching Videos", error);
            setVideos([]);
        });
    };


    const handleVideoUpload = async (event) => {
        const file = event.target.files[0];

        if (!file)
            return;

        setVideoFile(file);

        const formData = new FormData();
        formData.append('video', file);

        const response = await fetch("/upload", {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            alert("Video uploaded successfully!");
            fetchVideos();
        } else {
            alert("Video upload failed.");
        }
    };

    const handleVideoSelect = (event) => {
        const filename = event.target.value;
        setSelectedVideo(filename);
        setVideoURL(`/videos/${filename}`);
    }

    return (
      <div className="app-container">
        <header classname="header">
          <h1>Video Analysis App</h1>
        </header>

        <nav className="nav-bar">
          <button onClick={() => setCurrentPage('home')}>Home</button>
          <button onClick={() => setCurrentPage('videos')}>Videos</button>
          <button onClick={() => setCurrentPage('model')}>Model</button>
        </nav>

          <br/>
          <br/>
          <br/>

          <div classname="content">
              {currentPage === "home" && (
                  <div>
                      <h2>Welcome to the Video Analysis App</h2>
                      <p>This application allows you to upload videos and analyze them using the ML model</p>
                      <p>Navigate to the "Videos" tab to get started</p>
                      <p>A bunch of more information blah blah blah</p>
                  </div>
              )}

              {currentPage === "videos" && (
                  <div>
                      <h2>Upload % Select Videos</h2>
                      <input type="file" accept={"video/*"} onChange={handleVideoUpload} />
                      <br />
                      <label>Select a Video:</label>
                      <select onChange={handleVideoSelect}>
                          <option value="">-- Select A Video --</option>
                          {videos.map((video, index) => (
                              <option key={index} value={video}>{video}</option>
                          ))}
                      </select>
                      {videoURL && (
                          <video width="640" height="360" controls>
                              <source src={videoURL} type="video/mp4" />
                              Error: Your browser does not support the video
                          </video>
                      )}
                      <br />
                      <button onClick={() => setCurrentPage('model')}>Analyze with Model</button>
                  </div>
              )}

              {currentPage === "model" && (
                  <div>
                      <h2>ML Model Analysis</h2>
                      <p>Here you will see results of the ML Model processing your video</p>
                      <p>More details</p>
                  </div>
              )}
          </div>
      </div>
    );
}

export default App;