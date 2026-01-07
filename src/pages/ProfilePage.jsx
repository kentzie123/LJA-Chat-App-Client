// Hooks
import { useRef, useState } from "react";

// Lucide icons
import { User, Mail, Camera } from "lucide-react";

// Stores
import { useAuthStore } from "../store/useAuthStore";

// Toast notification
import toast from "react-hot-toast";
import { useEffect } from "react";

const ProfilePage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const selectPic = useRef(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [profileInfo, setProfileInfo] = useState({
    fullname: authUser.fullname,
    email: authUser.email,
  });

  const handleSelectImage = (imageFile) => {
    console.log(imageFile);
    const supportedTypes = ["image/jpeg", "image/png"];

    if (!supportedTypes.includes(imageFile.type)) {
      console.log("image not supported");

      toast.error("File type not supported!");
      return;
    }

    if (imageFile.size / (1024 * 1024) > 10) {
      toast.error("File size exceeds 10MB!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImg(reader.result);
      updateProfile({profile_pic: reader.result});
    };

    if (imageFile) {
      reader.readAsDataURL(imageFile);
    }
  };

  const handleUpdateInformation = () => {
    if (
      authUser.fullname === profileInfo.fullname &&
      authUser.email === profileInfo.email
    ) {
      toast.error("Cannot update the same information");
    } else {
      updateProfile(profileInfo);
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center flex-col gap-3 bg-base-200">
      <div className="bg-base-300 p-7 space-y-6 w-[60vw] rounded-lg">
        <div className="text-center text-base-content">
          <h1 className="text-2xl font-medium">Profile</h1>
          <div>Your profile information</div>
        </div>

        <div className="flex justify-center">
          <input
            onChange={(e) => {
              handleSelectImage(e.target.files[0]);
            }}
            ref={selectPic}
            type="file"
            accept="image/*"
            className="hidden"
          />
          <div className="relative">
            <img
              className="size-35 rounded-full border-3 border-base-content object-cover"
              src={selectedImg || authUser.profile_pic || "/default.png"}
              alt="profile"
            />
            <div
              onClick={() => selectPic.current.click()}
              className="absolute bottom-0 right-0 bg-base-200 hover:bg-base-100 p-2 rounded-full cursor-pointer"
            >
              <Camera className="text-base-content" />
            </div>
          </div>
        </div>
        <div className="text-center text-sm opacity-50">
          Click the camera icon to update your photo
        </div>
      </div>

      <div className="flex flex-col bg-base-300 p-7 space-y-6 w-[60vw] h-fit rounded-lg">
        <h1 className="text-lg font-medium">Personal Information</h1>
        <div className="space-y-5">
          <div>
            <div className="flex items-center opacity-60 mb-1 gap-1">
              <User className="size-4" />
              <div>Fullname</div>
            </div>
            <input
              value={profileInfo.fullname}
              onChange={(e) =>
                setProfileInfo({ ...profileInfo, fullname: e.target.value })
              }
              className="input w-full"
              type="text"
            />
          </div>
          <div>
            <div className="flex items-center opacity-60 mb-1 gap-1">
              <Mail className="size-4" />
              <div>Email</div>
            </div>
            <input
              value={profileInfo.email}
              onChange={(e) =>
                setProfileInfo({ ...profileInfo, email: e.target.value })
              }
              className="input w-full"
              type="text"
            />
          </div>
        </div>
        <button
          onClick={handleUpdateInformation}
          className="btn btn-success w-fit self-center"
          type="text"
          disabled={isUpdatingProfile ? true : false}
        >
          {!isUpdatingProfile ? (
            "Update Information"
          ) : (
            <div>
              <span className="loading loading-spinner loading-sm mr-2"></span>
              Loading...
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
