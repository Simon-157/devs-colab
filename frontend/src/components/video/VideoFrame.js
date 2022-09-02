import React from 'react'
import videoFrameStyles from "./video-frame.module.scss"

const VideoFrame = () => {
    const otherVideos=[];
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
                //   ref={video => {
                //     if (video) { video.srcObject = ""}
                //   }}
                //   autoPlay={true}
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

export default VideoFrame