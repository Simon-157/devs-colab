import React from 'react'
import MainEditor from '../../components/code-editor/MainEditorFrame'
import Stream from '../../components/video-room/Stream'
import roomStyles from "./room-Styles.module.scss"
const GroupEditor = () => {
  return (
    <div className ={roomStyles.container}>
        <MainEditor />
        <div className ={roomStyles.videoSec}>
          <Stream />
        </div>
    </div>
  )
}

export default GroupEditor