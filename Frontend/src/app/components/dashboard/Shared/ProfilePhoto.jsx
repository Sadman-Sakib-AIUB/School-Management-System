import axiosInstance from "@/src/lib/axiosInstance";
import { AlertCircle, Camera, CheckCircle2, Loader2 } from "lucide-react";
import { useRef, useState } from "react";

const ProfilePhoto = ({ photoUrl, initials, onUploadSuccess }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // validate
    if (!file.type.startsWith("image/")) {
      setErrorMsg("শুধুমাত্র ছবি ফাইল গ্রহণযোগ্য।");
      setStatus("error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("ফাইলের আকার ৫ MB এর বেশি হওয়া যাবে না।");
      setStatus("error");
      return;
    }

    // local preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);

    // upload
    setStatus("uploading");
    setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("profilePhoto", file);
      const res = await axiosInstance.post("/upload/profile-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newUrl = res.data?.data?.profilePhotoUrl;
      setStatus("success");
      onUploadSuccess?.(newUrl);
      // reset success indicator after 3s
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setPreview(null);
      setErrorMsg(err?.response?.data?.message || "আপলোড ব্যর্থ হয়েছে।");
      setStatus("error");
    } finally {
      // reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const displaySrc = preview || photoUrl;

  return (
    <div className="relative shrink-0">
      {/* avatar circle */}
      <div className="w-24 h-24 rounded-2xl shadow-md overflow-hidden bg-emerald-100 flex items-center justify-center">
        {displaySrc ? (
          <img
            src={displaySrc}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-emerald-700 font-bold text-3xl">{initials}</span>
        )}

        {/* uploading overlay */}
        {status === "uploading" && (
          <div className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center">
            <Loader2 size={24} className="text-white animate-spin" />
          </div>
        )}

        {/* success overlay */}
        {status === "success" && (
          <div className="absolute inset-0 rounded-2xl bg-emerald-500/70 flex items-center justify-center">
            <CheckCircle2 size={24} className="text-white" />
          </div>
        )}
      </div>

      {/* camera button */}
      {status !== "uploading" && (
        <button
          onClick={() => { setStatus("idle"); setErrorMsg(""); inputRef.current?.click(); }}
          title="প্রোফাইল ছবি পরিবর্তন করুন"
          className="absolute -bottom-8 right-0 w-full h-8 bg-violet-600 hover:bg-violet-700 text-white rounded-xl flex items-center justify-center shadow-md transition-colors border-2 border-white"
        >
          <Camera size={14} />
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* error toast */}
      {status === "error" && errorMsg && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl px-3 py-2 flex items-start gap-2 shadow-lg z-10">
          <AlertCircle size={13} className="shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
          <button onClick={() => setStatus("idle")} className="ml-auto shrink-0">
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfilePhoto;