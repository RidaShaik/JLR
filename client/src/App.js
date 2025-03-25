import React, {useState, useEffect, useRef} from 'react'
import './App.css'

import logo from './logo.png';

function App() {

    const videoRef = useRef(null);
    const [currentAnnotation, setCurrentAnnotation] = useState("");

const handleTimeUpdate = () => {
    if (videoRef.current) {
        const currentTimeDec = videoRef.current.currentTime.toFixed(1);
        const currentTimeInt = Math.floor(videoRef.current.currentTime)
        setCurrentAnnotation(`GT[${currentTimeInt}] start:${currentTimeDec}`);
      }
};

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
            <div className="header-content">
                <img src={logo} alt="logo" className="logo" />
                <h1 className="home-logo">Sports Action Detection</h1>
                <nav className="nav-bar">
                    <button onClick={() => setCurrentPage('home')}>Home</button>
                    <button onClick={() => setCurrentPage('clips')}>Clips</button>
                    <button onClick={() => setCurrentPage('detection')}>Detection</button>
                    <button onClick={() => setCurrentPage('upload')}>Upload</button>
                </nav>
            </div>
        </header>

          <br/>
          <br/>
          <br/>

          <div classname="content">
              {currentPage === "home" && (
                  <div>
                      <div className="video-container">
                          <video autoPlay loop muted>
                              <source src="./homeVid.mp4" type="video/mp4"/>
                              Vid Not Supported
                          </video>
                      </div>
                      <div className="home-content">
                          <h2 className="home-header">Welcome to the Video Analysis App</h2>
                          <p>This application allows you to upload videos and analyze them using the ML model</p>
                          <p>Navigate to the "Videos" tab to get started</p>
                          <p>A bunch of more information blah blah blah</p>
                      </div>
                  </div>
              )}

              {currentPage === "clips" && (
                  <div>
                      <h2>ML Model Analysis</h2>
                      <p>Here you will see results of the ML Model processing your video</p>
                      <p>More details</p>
                  </div>
              )}

              {currentPage === "detection" && (
                  <div>
                      <h2>ML Model Analysis</h2>
                      <p>Here you will see results of the ML Model processing your video</p>
                      <p>More details</p>
                  </div>
              )}

{currentPage === "upload" && (
        <div>
          <h2>Upload & Select Videos</h2>
          <input type="file" accept="video/*" onChange={handleVideoUpload} />
          <br />
          <label>Select a Video:</label>
                      <select onChange={handleVideoSelect}>
                          <option value="">-- Select A Video --</option>
                          {videos.map((video, index) => (
                              <option key={index} value={video}>{video}</option>
                          ))}
                      </select>
          {videoURL && (
            <div style={{ position: "relative", display: "inline-block" }}>
              <video 
                width="640" 
                height="360" 
                controls 
                ref={videoRef} 
                onTimeUpdate={handleTimeUpdate}
              >
                <source src={videoURL} type="video/mp4" />
                Error: Your browser does not support the video
              </video>

              {currentAnnotation && (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "rgba(0,0,0,0.7)",
                    color: "white",
                    padding: "5px",
                    borderRadius: "5px"
                  }}
                >
                  {currentAnnotation}
                </div>
              )}
            </div>
          )}
        </div>
      )}

          </div>
      </div>
    );
}

export default App;