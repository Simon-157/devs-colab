//libraries
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Peer from "peerjs"

//utils
import { socket } from '../../utils/socket';

//components
import VideoFrame from "./VideoFrame"


const RoomCreate = (props) => {
  const currentUser = sessionStorage.getItem('user');
  console.log(currentUser);
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
  const {roomId} = useParams();

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

        socket.on('call-accepted', ({ signal, answerId }) => {
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
      socket.emit('call-user', {
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
      socket.emit('accept-call', { signal, to: callerId });
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
    window.location.href = `/collab/${roomId}`;
  };

  const participants = () => {
     window.alert("Total number of participants are: "+ (peers.length + 1));
  }


  return (
    <div onClick={false}>
      <div>
        <div>
          {participants()}
          <div
            className={`width-peer${peers.length > 8 ? '' : peers.length}`}
          >
            {userVideoAudio['localUser'].video ? null : (
              <div>{currentUser}</div>
            )}
            <video
              // onClick={expandScreen}
              ref={userVideoRef}
              muted
              autoPlay
              playInline
            ></video>
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



// {showModal? (
        
//   <div className="opacity-75 fixed z-0 bg-gray-300 flex justify-center items-center fade top-0 left-0  w-full h-full outline-none overflow-x-hidden overflow-y-auto">
//   <div className=" relative w-auto my-6 mx-auto max-w-3xl">
//       <div style={{backgroundColor: '#EAFCFF'}} className="border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
//       <div className="flex items-start justify-between p-5 -b border-solid border-gray-300 rounded-t ">
//           <h6 className="text-3xl font=semibold"> GENERATE ROOM : {activeChallenge.title}</h6>
//           <button
//           className="bg-transparent border-0 text-black float-right"
//           onClick={() => setShowModal(false)}
//           >
//           <span className="text-red-500 justify-center opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
//               x
//           </span>
//           </button>
//       </div>
//       <div className="relative p-6 flex-auto">
//           <div className="outline relative border-2 focus-within:border-blue-500">
//               <input type="text" name="username" placeholder=" " ref={userRef} className="block p-4 w-full text-lg appearance-none focus:outline-none bg-transparent" />
//               <label for="username" className="absolute top-0 text-lg p-4 -z-1 duration-300 origin-0">Username</label>
//           </div>
//           <div className="outline relative border-2 focus-within:border-blue-500">
//               <input type="text" name="groupname" placeholder=" " ref={roomRef} className="block p-4 w-full text-lg appearance-none focus:outline-none bg-transparent" />
//               <label for="groupname" className="absolute top-0 text-lg p-4 -z-1 duration-300 origin-0">Group Name</label>
//           </div>
//       </div>
//       <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
//           {error ? <div style={{ fontSize: "25px" , color: "#e85a71"}}>{errorMsg}</div> : null}
//           <button
//           style={{backgroundColor:"#e85a71"}}
//           className="text-white  active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
//           type="button"
//           onClick={() => setShowModal(false)}
//           >
//           Close
//           </button>
//           <button
//           style={{backgroundColor:"#073b6b"}}
//           className="text-white active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
//           type="button"
//           onClick={() => {startSubmitHandler()}}
//           >
//           Join
//           </button>

//       </div>
//       </div>
//   </div>
//   </div>

// ) : null}
