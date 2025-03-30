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

    const [newsArticles, setNewsArticles] = useState([]);


    useEffect(() => {
        fetchVideos();
    }, []);

    useEffect(() => {
        fetchSportsNews();
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

    const fetchSportsNews = async () => {
        try {
            const response = await fetch(`https://newsapi.org/v2/top-headlines?category=sports&language=en&pageSize=5&apiKey=acda77d8110a49ef8f1dfcfa849d0697`);
            const data = await response.json();
            setNewsArticles(data.articles);
        }
        catch (error) {
            console.error("Error fetching SportsNews", error);
        }
    }


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
            <h1>Sports Action Detection</h1>
            <nav className="nav-bar">
              <button onClick={() => setCurrentPage('home')}>Home</button>
              <button onClick={() => setCurrentPage('clips')}>Clips</button>
              <button onClick={() => setCurrentPage('detection')}>
                Detection
              </button>
              <button onClick={() => setCurrentPage('upload')}>Upload</button>
            </nav>
          </div>
        </header>

        <br />
        <br />
        <br />

        <div classname="content">
          {currentPage === 'home' && (
            <div>
              <div className="video-container">
                <video autoPlay loop muted>
                  <source src="./homeVid.mp4" type="video/mp4" />
                  Vid Not Supported
                </video>
              </div>
              <div className="home-content">
                <h2>Welcome to the Video Analysis App</h2>
                <p>
                  This application allows you to upload videos and analyze them
                  using the ML model
                </p>
                <p>Navigate to the "Videos" tab to get started</p>
                <p>A bunch of more information blah blah blah</p>
              </div>
            </div>
          )}

          {currentPage === 'clips' && (
            <div className="clips-container">
              {videos.length === 0 ? (
                <p>No videos uploaded yet.</p>
              ) : (
                <div className="video-grid">
                  {videos.map((video, index) => (
                    <div
                      className="video-card"
                      key={index}
                      onClick={() => {
                        setSelectedVideo(video);
                        setVideoURL(`/videos/${video}`);
                        setCurrentPage('detection');
                      }}
                    >
                      <video
                        width="320"
                        height="180"
                        className="clip-video"
                        muted
                        preload="metadata"
                        onMouseEnter={(e) => e.target.play()}
                        onMouseLeave={(e) => {
                          e.target.pause();
                          e.target.currentTime = 0; // resets to beginning
                        }}
                      >
                        <source src={`/videos/${video}`} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <p className="video-title">{video}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentPage === 'detection' && (
            <div className="detection-container">
              {videoURL ? (
                <div className="detection-content">
                  <video
                    className="detection-video"
                    src={videoURL}
                    controls
                    autoPlay
                  />
                  <div className="analysis-box">
                    <h3>TAD Analysis</h3>
                    <p>model stuff goes here blah blah</p>
                  </div>
                </div>
              ) : (
                <p>No Video Selected, Please select from Clips tab</p>
              )}
            </div>
          )}

          {currentPage === 'upload' && (
            <div className="upload-container">
              <div className="upload-content">
                <label htmlFor="upload-input" className="upload-button">
                  Upload Video
                </label>
                <input
                  id="upload-input"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  style={{ display: 'none' }}
                />

                  <div className="news-section">
                      <h2>Latest Sports News</h2>
                      {newsArticles.length > 0 ? (
                          <div className="news-grid">
                              {newsArticles.map((article, index) => (
                                  <div className="news-card" key={index}>
                                      {article.urlToImage && (
                                          <img src={article.urlToImage} alt="News" className="news-image" />
                                      )}
                                      <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-card-title">
                                          {article.title}
                                      </a>
                                      <p className="news-card-description">{article.description}</p>
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <p>Loading news...</p>
                      )}
                  </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
}

export default App;