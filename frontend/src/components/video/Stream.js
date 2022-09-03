import {useState } from "react"
import VideoFrame from "./VideoFrame"
import {io} from "socket.io-client";
import videoFrameStyles from "./video-frame.module.scss"


const Stream = () => {
    const [myVideoStream, setMyVideoStream] =useState({})

    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
    })
    .then((stream) => {
        setMyVideoStream(stream);
        stream.getVideoTracks()[0].enabled = false;
        stream.getAudioTracks()[0].enabled = false;
  
        const newParticipants = Object.assign({}, collabs);
        setCollabs(newParticipants)
        setStreamPublished(true)
        
        
    });

    const [peers, setPeers] = useState({})
    const [newPeerId, setNewPeerId] = useState(undefined)
    const [streamPublished,setStreamPublished] = useState(false)
    const [videos, setVideos] = useState({})
    const [audioMuted, setAudioMuted] = useState(true)
    const [videoMuted, setVideoMuted] = useState(true)
    const [collabs, setCollabs] = useState({})

   
    const otherVideos=[];
    const ownVideo = myVideoStream.id
  return (
    <div className={videoFrameStyles.videoGrid}>
        <ul>
          <li className={videoFrameStyles.videoFirst} key={null}>
            <div className={videoFrameStyles.videoIconContainer}>
              <div className={videoFrameStyles.videoIconDiv} onClick={null}>
                {null}
              </div>
              <div className={videoFrameStyles.videoIconDiv} onClick={null}>
                {null}
              </div>
            </div>
            <video className={videoFrameStyles.videoItem}
                  ref={video => {
                    // if (video) { video.srcObject = {myVideoStream}}
                  }}
                  autoPlay={true}
            >
            </video>
            <div className={videoFrameStyles.videoName}>
              {/* <p>{this.state.participants[this.myVideoStream.id]}</p> */}
            </div>
          </li>
          {
            otherVideos?.map(stream => {
              return (
                <li key={stream.id} className={videoFrameStyles.videoListItem}>
                  <video className={videoFrameStyles.videoItem}
                    ref={video => {
                      if (video) { video.srcObject = stream }
                    }}
                    autoPlay={true}
                  >
                  </video>
                  <div className={videoFrameStyles.videoName}>
                    {/* <p>{this.state.participants[stream.id]}</p> */}
                  </div>
                </li>
              )
            })
          }
        </ul>
      </div>
  )
}
export default Stream;