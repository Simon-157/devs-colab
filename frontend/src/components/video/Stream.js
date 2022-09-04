import {useState, useEffect, useRef } from "react"
import {useQuery} from "react-query"
import VideoFrame from "./VideoFrame"
import {io} from "socket.io-client";
import videoFrameStyles from "./video-frame.module.scss"

const socket =  io("ws://localhost:5001", {
  withCredentials: true,
})
const Stream = () => {
    // const {socket} = useQuery("socket-connection",{()=>{io('wss://localhost:5001')}})
    const [myVideoStream, setMyVideoStream] =useState({})
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState();
    const [name, setName] = useState('');
    const [call, setCall] = useState({});
    const [me, setMe] = useState('');

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          setStream(currentStream);
  
          myVideo.current.srcObject = currentStream;
        });
  
      socket.on('me', (id) => setMe(id));
  
      socket.on('callUser', ({ from, name: callerName, signal }) => {
        setCall({ isReceivingCall: true, from, name: callerName, signal });
      });
    }, []);

    // const [peers, setPeers] = useState({})
    // const [newPeerId, setNewPeerId] = useState(undefined)
    // const [streamPublished,setStreamPublished] = useState(false)
    // const [videos, setVideos] = useState({})
    // const [audioMuted, setAudioMuted] = useState(true)
    // const [videoMuted, setVideoMuted] = useState(true)
    // const [collabs, setCollabs] = useState({})

   
    const otherVideos=[];
    // const ownVideo = myVideoStream.id
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
                  playsInline muted ref={myVideo} autoPlay
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