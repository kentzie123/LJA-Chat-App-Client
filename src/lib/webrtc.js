export function createPeerConnection(setRemoteVideoStream, myVideoStream) {
  const iceServersConfig = {
    iceServers: [
      { urls: "stun:ss-turn1.xirsys.com" },
      {
        urls: [
          "turn:ss-turn1.xirsys.com:80?transport=udp",
          "turn:ss-turn1.xirsys.com:3478?transport=udp",
          "turn:ss-turn1.xirsys.com:80?transport=tcp",
          "turn:ss-turn1.xirsys.com:3478?transport=tcp",
          "turns:ss-turn1.xirsys.com:443?transport=tcp",
          "turns:ss-turn1.xirsys.com:5349?transport=tcp",
        ],
        username: import.meta.env.VITE_YOUR_XIRSYS_USERNAME,
        credential: import.meta.env.VITE_YOUR_XIRSYS_CREDENTIAL,
      },
    ],
  };

  const pc = new RTCPeerConnection(iceServersConfig);

  pc.ontrack = (event) => {
    setRemoteVideoStream(event.streams[0]);
  };

  myVideoStream.getTracks().forEach((track) => pc.addTrack(track, myVideoStream));

  return pc;
}