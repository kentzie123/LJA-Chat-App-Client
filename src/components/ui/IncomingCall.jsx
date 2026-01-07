// Stores
import { useVideoCallStore } from "../../store/useVideoCallStore";

// Lucide icons
import { X, Phone, PhoneOff } from "lucide-react";

const IncomingCall = () => {
  const { callerInfo, handleRejectCall, handleAnswerCall } = useVideoCallStore();
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/80 z-[100]">
      <div className="relative flex flex-col justify-center items-center bg-base-100 p-5 rounded-lg space-y-3 w-[260px]">
        <img
          className="size-25 border-4 border-primary rounded-full"
          src={
            callerInfo?.profile_pic ? callerInfo?.profile_pic : "/default.png"
          }
          alt="caller-profile"
        />
        <div>Incoming Call</div>
        <div className="font-bold">{callerInfo?.fullname}</div>
        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handleRejectCall}
            type="button"
            className="btn btn-error btn-circle"
          >
            <PhoneOff className="size-4" />
          </button>
          <button onClick={handleAnswerCall} type="button" className="btn btn-success btn-circle">
            <Phone className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;
