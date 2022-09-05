import {useState, useEffect, useRef, useParams } from "react"
import {useQuery} from "react-query"
import VideoFrame from "./VideoFrame"
import {io} from "socket.io-client";
import Peer from "peerjs"
import videoFrameStyles from "./video-frame.module.scss"

const socket =  io("http://localhost:5001/")

let myStream, peer;
let peers = [];

const Stream = () => {
    // const {socket} = useQuery("socket-connection",{()=>{io('wss://localhost:5001')}})
    const [myVideoStream, setMyVideoStream] =useState({})
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState();
    const [name, setName] = useState('');
    const [call, setCall] = useState({});
    const [me, setMe] = useState('');
    const [muted, setMuted] = useState(false);
    const [hideVideo, setHideVideo] = useState(false);

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    const { roomId } = useParams();

    // useEffect(() => {
    //   navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    //     .then((currentStream) => {
    //       setStream(currentStream);
  
    //       myVideo.current.srcObject = currentStream;
    //     });
  
    //   socket.on('me', (id) => setMe(id));
  
    //   socket.on('callUser', ({ from, name: callerName, signal }) => {
    //     setCall({ isReceivingCall: true, from, name: callerName, signal });
    //   });
    // }, []);

    useEffect(() => {
      peer = new Peer(undefined, {
        path: '/peerjs',
        host: '/',
        port: 5001,
      });
      peer.on('open', (id) => {
        socket.emit('join-room', roomId, id);
      });
  
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          //audio: true,
        })
        .then((stream) => {
          myStream = stream;
          const myVideo = document.createElement('video');
          handleAddVideoStream(myVideo, myStream);
          handleAnswerCall(stream);
        })
        .catch((error) => {
          console.error(error);
        });
  
      socket.on('user-disconnected', (userId) => {
        if (peers[userId]) peers[userId].destroy();
        socket.disconnect();
      });
      const handleAnswerCall = (stream) => {
        peer.on('call', (call) => {
          call.answer(stream);
          const video = document.createElement('video');
          call.on('stream', (userVideoStream) => {
            handleAddVideoStream(video, userVideoStream);
          });
        });
      };
  
      const handleNewUserJoin = () => {
        socket.on('user-connected', (userId) => {
          navigator.mediaDevices
            .getUserMedia({
              video: true,
              //audio: true, // For Testing Purpose
            })
            .then((stream) => {
              const call = peer.call(userId, stream);
              const video = document.createElement('video');
  
              call.on('stream', (userVideoStream) => {
                handleAddVideoStream(video, userVideoStream);
              });
  
              call.on('close', () => {
                video.remove();
              });
  
              peers[userId] = call;
            })
            .catch((error) => {
              console.error(error);
            });
        });
      };
  
      handleNewUserJoin();
  
      return () => {
        socket.off();
      };
    }, [roomId]);
  
   
    const handleAddVideoStream = (video, stream) => {
      const videoGrid = document.getElementById('video-grid');
      video.srcObject = stream;
  
      video.addEventListener('loadedmetadata', () => {
        video.play();
        video.muted = true; // muted for testing purposes
      });
      videoGrid.append(video);
    };
  
    // Handlining Mute And Unmute
    const handleMuteUnmute = () => {
      const enabled = myStream.getAudioTracks()[0].enabled;
      if (enabled) {
        myStream.getAudioTracks()[0].enabled = false;
        setMuted(true);
      } else {
        myStream.getAudioTracks()[0].enabled = true;
        setMuted(false);
      }
    };
  
    //Handling video off and one
    const handlePlayStopVideo = () => {
      const enabled = myStream.getVideoTracks()[0].enabled;
  
      if (enabled) {
        myStream.getVideoTracks()[0].enabled = false;
        setHideVideo(true);
      } else {
        myStream.getVideoTracks()[0].enabled = true;
        setHideVideo(false);
      }
    };
    


   
    // const otherVideos=[];
    // const ownVideo = myVideoStream.id
  return (
    <div className={videoFrameStyles.videoGrid}>
        <ul>
          <li className={videoFrameStyles.videoFirst} key={null}>
            <div className={videoFrameStyles.videoIconContainer}>
              <div id= "video-grid" className={videoFrameStyles.videoIconDiv} >
                
              </div>
              <div className={videoFrameStyles.videoIconDiv}>
                
              </div>
            </div>

          </li>
        </ul>
      </div>
  )
}
export default Stream;