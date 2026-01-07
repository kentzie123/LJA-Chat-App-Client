import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import DraggableVideo from "./DraggableVideo";

// Stores
import { useVideoCallStore } from "../../store/useVideoCallStore";

const VideoCallModal = () => {
  const { setIsCalling, setMyVideoStream, remoteVideoStream, handleEndCall, myVideoStream } =
    useVideoCallStore();
  const localVideoRef = useRef(null);
  const streamRef = useRef(null); // for resetting the stream
  const remoteVideoRef = useRef(null); // for the other user's camera

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  useEffect(() => {
    localVideoRef.current.srcObject = myVideoStream;
    streamRef.current = myVideoStream;

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // For streaming other user's video stream
  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteVideoStream || null;
    }
  }, [remoteVideoStream]);


  // Call buttons function
  const toggleMic = () => {
    const audioTrack = streamRef.current?.getAudioTracks()[0];
    if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
    setIsMicOn((prev) => !prev);
  };

  const toggleCam = () => {
    const videoTrack = streamRef.current?.getVideoTracks()[0];
    if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
    setIsCamOn((prev) => !prev);
  };

  // const endCall = () => {
  //   streamRef.current?.getTracks().forEach((track) => track.stop());
  //   setIsCalling(false);
  // };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/80 z-[100]">
      <div className="relative h-[60%] w-full max-w-[800px] rounded-lg overflow-hidden bg-black">
        {/* Remote user's camera (full background) */}
        <video
          ref={remoteVideoRef}
          className="w-full h-full object-cover scale-x-[-1]"
          autoPlay
          playsInline
        />

        {/* My camera (floating preview) */}
        <DraggableVideo>
          <video
            ref={localVideoRef}
            className="rounded-lg border-2 border-primary bg-base-100 object-cover scale-x-[-1] shadow-lg cursor-move
               sm:w-48 sm:h-32 h-45 w-32"
            autoPlay
            playsInline
            muted
          />
        </DraggableVideo>

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 p-3 rounded-full bg-gray-900/70 backdrop-blur-sm shadow-lg">
          <button
            onClick={toggleMic}
            type="button"
            className={`btn ${!isMicOn ? "btn-error" : ""} btn-circle`}
          >
            {isMicOn ? (
              <Mic className="size-4" />
            ) : (
              <MicOff className="size-4" />
            )}
          </button>
          <button
            onClick={toggleCam}
            type="button"
            className={`btn ${!isCamOn ? "btn-error" : ""} btn-circle`}
          >
            {isCamOn ? (
              <Video className="size-4" />
            ) : (
              <VideoOff className="size-4" />
            )}
          </button>
          <button
            onClick={handleEndCall}
            type="button"
            className="btn btn-error btn-circle"
          >
            <PhoneOff className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
