import {useState } from "react"
const Stream = () => {
    const [peers, setPeers] = useState({})
    const [newPeerId, setNewPeerId] = useState(undefined)
    const [streamPublished,setStreamPublished] = useState(false)
    const [videos, setVideos] = useState({})
    const [audioMuted, setAudioMuted] = useState(true)
    const [videoMuted, setVideoMuted] = useState(true)
    const [collabs, setCollabs] = ({})

    return (
        <div>

        </div>
    )
}

export default Stream;