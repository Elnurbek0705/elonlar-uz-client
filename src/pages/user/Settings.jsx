import React from "react";
import { useDispatch, useSelector } from "react-redux";

const ProfileSettings = () => {
   const { userInfo } = useSelector((state) => state.user);
   const dispatch = useDispatch();
   console.log(userInfo);
   


   
  return (
    <div className="dark:bg-zinc-700 bg-zinc-300 inset-shadow-sm inset-shadow-zinc-500 rounded-lg shadow-md p-10 w-full flex flex-col gap-4 ">
      <b className="text-2xl font-semibold py">Profile Settings</b>
      <span className="text-md text-zinc-600 dark:text-zinc-300">
        Barcha sozlamalarni shu yerda ko’rishingiz mumkin.
      </span>
      {/* horizontal line dashed */}
      <hr className="border-dashed border-zinc-400 dark:border-zinc-500 my-4" />
      {/* Settings Form 2 col */}
      
      <div className="grid grid-cols-[0.5fr_2.5fr] gap-4">
         <div className="flex flex-row gap-2 rounded-2xl p-4 border border-zinc-400 dark:border-zinc-500 w-[420px] h-[420px] inset-shadow-sm inset-shadow-zinc-500">
            {/* username and role */}
            {userInfo && (
              <div className="flex flex-col items-center w-full">
                <span className="text-lg font-semibold">{userInfo.user?.name}</span>
                {/* <img src={userInfo.avatar} alt="User Avatar" className="rounded-full w-24 h-24 mb-4" /> */}
              </div>
            )}
         </div>


         <div className="flex flex-col gap-4 rounded-2xl p-4 border border-zinc-400 dark:border-zinc-500 w-full h-[420px] inset-shadow-sm inset-shadow-zinc-500">
            <div className="flex flex-col gap-2">
               <label className="font-semibold">Ism</label>
               <input
                 type="text"
                 name="name"
                 value={userInfo.user?.name || ""}
                 className="border p-2 rounded"
                 readOnly
               />
            </div>
         </div>
      </div>

    </div>
  );
};

export default ProfileSettings;
