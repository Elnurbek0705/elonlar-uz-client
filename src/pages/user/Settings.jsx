import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { updateUserInfo } from "../../redux/userSlice";
import { UserCircle } from "lucide-react";

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    contactNumber: "",
    contactLink: "",
    gender: "",
  });

  useEffect(() => {
    if (userInfo?.user) {
      setFormData({
        name: userInfo.user.name || "",
        lastName: userInfo.user.lastName || "",
        email: userInfo.user.email || "",
        contactNumber: userInfo.user.contactNumber || "",
        contactLink: userInfo.user.contactLink || "",
        gender: userInfo.user.gender || "",
      });
    }
  }, [userInfo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = userInfo?.token;
      if (!token) throw new Error("Token topilmadi");

      const res = await axios.put(
        "http://localhost:5000/api/users/update",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Ma’lumotlar muvaffaqiyatli saqlandi ✅", {
        duration: 2500,
      });

      dispatch(updateUserInfo({ ...userInfo, user: res.data.user }));
    } catch (err) {
      toast.error("Xatolik yuz berdi ❌", { duration: 2500 });
      console.error(err);
    }
  };

  return (
    <div className="dark:bg-zinc-700 bg-zinc-300 inset-shadow-sm inset-shadow-zinc-500 rounded-lg shadow-md p-6 md:p-10 w-full flex flex-col gap-4">
      <Toaster position="top-center" reverseOrder={false} />

      <b className="text-2xl font-semibold">Profile Settings</b>
      <span className="text-md text-zinc-600 dark:text-zinc-300">
        Barcha sozlamalarni shu yerda ko’rishingiz mumkin.
      </span>

      <hr className="border-dashed border-zinc-400 dark:border-zinc-500 my-4" />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
        <div className="flex flex-col items-center justify-center rounded-2xl p-4 border border-zinc-400 dark:border-zinc-500 w-full h-64 md:h-[420px] inset-shadow-sm inset-shadow-zinc-500">
          <span className="text-lg font-semibold">
            {formData.name} {formData.lastName}
          </span>
          <div className="w-32 h-32 mt-4 rounded-full overflow-hidden flex items-center justify-center bg-zinc-200 dark:bg-zinc-600">
            <img
              src={userInfo?.avatar ||  "https://cdn-icons-png.flaticon.com/512/149/149071.png" }
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl p-4 border border-zinc-400 dark:border-zinc-500 w-full  inset-shadow-sm inset-shadow-zinc-500 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Ism</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Familiya</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Telefon raqam</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Telegram / Link</label>
            <input
              type="text"
              name="contactLink"
              value={formData.contactLink}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Jins</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="">Tanlang</option>
              <option value="male">Erkak</option>
              <option value="female">Ayol</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
          >
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
