//libraries
import React, { useState, useEffect, useRef } from 'react';
import Peer from "peerjs"

//utils
import { socket } from '../../utils/socket';

//components
import VideoFrame from "./VideoFrame"


const RoomCreate = (props) => {
  const currentUser = sessionStorage.getItem('user');
  const [peers, setPeers] = useState([]);
  const [userVideoAudio, setUserVideoAudio] = useState({
    localUser: { video: true, audio: true },
  });
  const [videoServices, setVideoServices] = useState([]);
  const [showVideoServices, setShowVideoServices] = useState(false);
  const peersRef = useRef([]);
  const userVideoRef = useRef();
  const screenTrackRef = useRef();
  const userStream = useRef();
  const roomId = props.match.params.roomId;

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((device) => {
      const filteredDevices = device.filter((device) => device.kind === 'videoinput');
      setVideoServices(filteredDevices);
    })

    window.addEventListener('popstate', goToBack);

    navigator.mediaDevices
      .getUserMedia({video: true, audio: true})
      .then((stream) => {
        userVideoRef.current.srcObject = stream;
        userStream.current = stream;
        
        socket.emit("join-room", {roomId, userName:currentUser});
        socket.on("user-join", (users) => {
          const peers = [];

          users.forEach(({userId,info}) =>{
            let { userName, video, audio } = info;

            if(userName !==currentUser){
              const peer = createPeer(userId, socket.id, stream)

              peer.userName = userName;
              peer.peerId = userId;

              peersRef.current.push({
                peerId: userId,
                peer,
                userName,
              });
              peers.push(peer);
              setUserVideoAudio((preList) => {
                return {
                  ...preList,
                  [peer.userName]: { video, audio },
                };
              });
            }
          });

          setPeers(peers);
        });

        socket.on('receive-call', ({signal, from, info}) => {
          let { userName, video, audio } = info;
          const peerIdx = findPeer(from);

          if(!peerIdx) {
            const peer =addPeer(signal, from, stream);
            peer.userName = userName;
            peersRef.current.push({
              peerId: from,
              peer,
              userName: userName,
            });
            setPeers((users) => {
              return [...users, peer];
            });
            setUserVideoAudio((preList) => {
              return {
                ...preList,
                [peer.userName]: { video, audio },
              };
            });
          }
        });

        socket.on('FE-call-accepted', ({ signal, answerId }) => {
          const peerIdx = findPeer(answerId);
          peerIdx.peer.signal(signal);
        });

        socket.on('user-leave', ({ userId, userName }) => {

          const peerIdx = findPeer(userId);
          peerIdx.peer.destroy();

          setPeers((users) =>{
            users = users.filter((user) => user.peerId !== peerIdx.peer.peerId);
            return [...users];
          });
        });
      });

      socket.on('toggle-camera', ({ userId, switchTarget }) => {
        const peerIdx = findPeer(userId);
  
        setUserVideoAudio((preList) => {
          let video = preList[peerIdx.userName].video;
          let audio = preList[peerIdx.userName].audio;
  
          if (switchTarget === 'video') video = !video;
          else audio = !audio;
  
          return {
            ...preList,
            [peerIdx.userName]: { video, audio },
          };
        });
      });
  
      return () => {
        socket.disconnect();
      };

  }, [])


  const createPeer = (userId, caller, stream) =>{
    const peer = new Peer({initiator:true, trickler:false, stream });
    peer.on('signal', (signal) => {
      socket.emit('BE-call-user', {
        userToCall: userId,
        from: caller,
        signal,
      });
    });
    peer.on('disconnect', () => {
      peer.destroy();
    });

    return peer;

  }

  const addPeer = (incomingSignal, callerId, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socket.emit('BE-accept-call', { signal, to: callerId });
    });

    peer.on('disconnect', () => {
      peer.destroy();
    });

    peer.signal(incomingSignal);

    return peer;
  }

  const toggleCameraAudio = (e) => {
    const target = e.target.getAttribute('data-switch');

    setUserVideoAudio((preList) => {
      let videoSwitch = preList['localUser'].video;
      let audioSwitch = preList['localUser'].audio;

      if (target === 'video') {
        const userVideoTrack = userVideoRef.current.srcObject.getVideoTracks()[0];
        videoSwitch = !videoSwitch;
        userVideoTrack.enabled = videoSwitch;
      } else {
        const userAudioTrack = userVideoRef.current.srcObject.getAudioTracks()[0];
        audioSwitch = !audioSwitch;

        if (userAudioTrack) {
          userAudioTrack.enabled = audioSwitch;
        } else {
          userStream.current.getAudioTracks()[0].enabled = audioSwitch;
        }
      }

      return {
            ...preList,
            localUser: { video: videoSwitch, audio: audioSwitch },
          };
        });

        socket.emit('BE-toggle-camera-audio', { roomId, switchTarget: target });
    };


  const findPeer = (id)=> {
    return peersRef.current.find((p) => p.peerId === id);
  }

  const createUserVideo = (peer, index, arr) =>{
    return (
      <div
        className={`width-peer${peers.length > 8 ? '' : peers.length}`}
        // onClick={expandScreen}
        key={index}
      >
        {writeUserName(peer.userName)}
        {/* <FaIcon className='fas fa-expand' /> */}
        <VideoFrame key={index} peer={peer} number={arr.length} />
      </div>
    );
  }

  const writeUserName = (userName, index) =>{
    if (userVideoAudio.hasOwnProperty(userName)) {
      if (!userVideoAudio[userName].video) {
        return <div key={userName}>{userName}</div>;
      }
    }
  }

  
  const invite = () => {
    navigator.clipboard.writeText(roomId)
  }

  const goToBack = () => {
    window.location.href = `/chat/${roomId}`;
  };

  const participants = () => {
     window.alert("Total number of participants are: "+ (peers.length + 1));
  }


  return (
    <div onClick={false}>
      <div>
        <div>
          {}
          <div
            className={`width-peer${peers.length > 8 ? '' : peers.length}`}
          >
            {userVideoAudio['localUser'].video ? null : (
              <div>{currentUser}</div>
            )}
            <div
              // onClick={expandScreen}
              ref={userVideoRef}
              muted
              autoPlay
              playInline
            ></div>
          </div>
          {}
          {peers &&
            peers.map((peer, index, arr) => createUserVideo(peer, index, arr))}
        </div>
      
      </div>
    </div>
    
  );
};

 
export default RoomCreate