import {useState, useEffect} from "react"
import {useParams} from 'react-router-dom'
import Peer from "peerjs"
import { socket } from "../../utils/socket"
import videoFrameStyles from "./video-frame.module.scss"


let myStream, peer;
let peers = [];

const Stream = () => {

    const [muted, setMuted] = useState(false);
    const [hideVideo, setHideVideo] = useState(false);
    let {roomId}  = useParams();


    useEffect(() => {
      console.log("roonImd = ", roomId)
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
          audio: true,
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