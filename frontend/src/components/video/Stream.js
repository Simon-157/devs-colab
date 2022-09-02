import {useState } from "react"
import VideoFrame from "./VideoFrame"
const Stream = () => {

    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      })


    const [peers, setPeers] = useState({})
    const [newPeerId, setNewPeerId] = useState(undefined)
    const [streamPublished,setStreamPublished] = useState(false)
    const [videos, setVideos] = useState({})
    const [audioMuted, setAudioMuted] = useState(true)
    const [videoMuted, setVideoMuted] = useState(true)
    const [collabs, setCollabs] = useState({})

    return (
        <div>
            <VideoFrame />
        </div>
    )
}

export default Stream;