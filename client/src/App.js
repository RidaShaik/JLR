import React, {useState, useEffect} from 'react'

function App() {

    const [videoFile, setVideoFile] = useState(null);
    const [videoURL, setVideoURL] = useState('');
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState("");


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
      <div>

          <input type="file" accept="video/*" onChange={handleVideoUpload}/>

          <br />

          <label>Select a Video:</label>
          <select onChange={handleVideoSelect}>
              <option value="">-- Select a Video--</option>
              {videos.map((video, index) => (
                  <option key={index} value={video}>{video}</option>
              ))}
          </select>

          {videoURL && (
              <video width="640" height="360" controls>
                  <source src={videoURL} type="video/mp4" />
                  Error: Your browser does not support this video
              </video>
          )}

      </div>
  )
}

export default App;