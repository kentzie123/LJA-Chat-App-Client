import { create } from "zustand";

// Stores
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

// WebRTC
import { createPeerConnection } from "../lib/webrtc";

const incomingCallMP3 = new Audio("/incomingCall.mp3");

export const useVideoCallStore = create((set, get) => ({
  isCalling: false,
  callerInfo: null,
  isSomeoneCalling: false,
  myVideoStream: null,
  remoteVideoStream: null,
  peerConnection: null,
  callerOffer: null,
  

  setRemoteVideoStream: (remoteVideoStream) => {
    set({ remoteVideoStream });
  },

  setMyVideoStream: (myVideoStream) => {
    set({ myVideoStream });
  },

  playIncomingCallerMP3: () => {
    incomingCallMP3.loop = true;
    incomingCallMP3.play();
  },

  stopIncomingCallerMP3: () => {
    incomingCallMP3.pause();
    incomingCallMP3.currentTime = 0;
  },

  setIsCalling: (bol) => {
    set({ isCalling: bol });
  },

  handleCallListeners: (socket) => {
    socket.on("incoming-call", ({ fromSocketId, callerInfo, offer }) => {
      set({ isSomeoneCalling: true, callerInfo, callerOffer: offer });
      get().playIncomingCallerMP3();
    });

    socket.on("call-rejected", () => {
      set({ isCalling: false, callerInfo: null });
      get().stopIncomingCallerMP3();
    });

    socket.on("call-answered", async ({ callerInfo, answer }) => {
      const pc = get().peerConnection;
      if (!pc) return;

      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      set({callerInfo});
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      const pc = get().peerConnection;
      if (!pc) return;

      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("Error adding received ICE candidate", error);
      }
    });

    socket.on("call-ended", () => {
      get().stopVideoCall();
    });
  },

  handleCallUser: async () => {
    const { socket } = useAuthStore.getState();
    const { selectedUser } = useChatStore.getState();

    if (!selectedUser) return;

    if (!get().myVideoStream) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        set({ myVideoStream: stream });
      } catch (err) {
        console.error("Failed to get local media stream", err);
        return;
      }
    }

    set({ isCalling: true });

    const pc = createPeerConnection(
      get().setRemoteVideoStream,
      get().myVideoStream
    );

    // Listen for ICE candidates and send to peer
    const selectedUserId = useChatStore.getState().selectedUser.id;
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          targetId: selectedUserId,
          candidate: event.candidate,
        });
      }
    };

    // Create offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    set({ peerConnection: pc });

    socket.emit("call-user", {
      targetId: selectedUser.id,
      callerInfo: useAuthStore.getState().authUser,
      offer,
    });
  },

  handleAnswerCall: async () => {
    const { socket } = useAuthStore.getState();
    const { callerInfo } = get();

    if (!get().myVideoStream) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        set({ myVideoStream: stream });
      } catch (err) {
        console.error("Failed to get local media stream", err);
        return;
      }
    }

    set({ isCalling: true });

    const pc = createPeerConnection(
      get().setRemoteVideoStream,
      get().myVideoStream
    );

    // Set remote description (caller’s offer)
    await pc.setRemoteDescription(new RTCSessionDescription(get().callerOffer));

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          targetId: callerInfo.id,
          candidate: event.candidate,
        });
      }
    };

    // Create answer and set local description
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    // Save peer connection
    set({ peerConnection: pc, isSomeoneCalling: false });
    get().stopIncomingCallerMP3();
    const myUserInfo = useAuthStore.getState().authUser;
    socket.emit("answer-call", { fromUserInfo: myUserInfo, callerUserId: callerInfo.id, answer });
  },

  handleRejectCall: () => {
    const { socket } = useAuthStore.getState();
    const { callerInfo } = get();

    if (!callerInfo) return;

    socket.emit("reject-call", { callerUserId: callerInfo.id });

    // Stop ringing locally
    set({ isSomeoneCalling: false, callerInfo: null });
    get().stopIncomingCallerMP3();
  },

  handleEndCall: () => {
    // Also notify the other user if you want (optional)
    const { socket } = useAuthStore.getState();
    const { callerInfo } = get();

    if(callerInfo){
      socket.emit("end-call", { targetId: callerInfo.id });
      get().stopVideoCall();
    }
  },

  stopVideoCall: () => {
    const pc = get().peerConnection;
    const myStream = get().myVideoStream;

    // Stop all local media tracks (camera/mic)
    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
    }

    // Close the WebRTC connection
    if (pc) {
      pc.close();
    }

    // Reset all related states
    set({
      isCalling: false,
      callerInfo: null,
      peerConnection: null,
      callerOffer: null,
      myVideoStream: null,
      remoteVideoStream: null,
    });

    // Stop ringing sound if playing
    get().stopIncomingCallerMP3();
  },
}));
