import React from "react";
import { useSelector } from "react-redux";

const ProfileSettings = () => {
  const { userInfo } = useSelector((state) => state.user);

  return (
    <div className="dark:bg-zinc-700 bg-zinc-300 inset-shadow-sm inset-shadow-zinc-500 rounded-lg shadow-md p-6 md:p-10 w-full flex flex-col gap-4">
      <b className="text-2xl font-semibold">Profile Settings</b>
      <span className="text-md text-zinc-600 dark:text-zinc-300">
        Barcha sozlamalarni shu yerda ko’rishingiz mumkin.
      </span>

      <hr className="border-dashed border-zinc-400 dark:border-zinc-500 my-4" />

      {/* Responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-[0.5fr_2.5fr] gap-4">
        {/* Left box */}
        <div className="flex flex-col items-center rounded-2xl p-4 border border-zinc-400 dark:border-zinc-500 w-full h-64 md:h-[420px] inset-shadow-sm inset-shadow-zinc-500">
          {userInfo && (
            <>
              <span className="text-lg font-semibold">{userInfo.user?.name}</span>
              {/* Avatar image */}
              {/* <img src={userInfo.avatar} alt="User Avatar" className="rounded-full w-24 h-24 mt-4" /> */}
            </>
          )}
        </div>

        {/* Right box */}
        <div className="flex flex-col gap-4 rounded-2xl p-4 border border-zinc-400 dark:border-zinc-500 w-full h-64 md:h-[420px] inset-shadow-sm inset-shadow-zinc-500">
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Ism</label>
            <input
              type="text"
              name="name"
              value={userInfo.user?.name || ""}
              className="border p-2 rounded w-full"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
