import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import {
  fetchElonlar,
  fetchSavedElons,
  saveElon,
  unsaveElon,
} from "../redux/elonSlice";
import Loader from "./Loader";

const CardsList = () => {
  const dispatch = useDispatch();
  const { elonlar, savedElons, loading, isLoaded } = useSelector(
    (state) => state.elon
  );

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const navigate = useNavigate();


  useEffect(() => {
    if (!isLoaded) dispatch(fetchElonlar());
    if (token) dispatch(fetchSavedElons(token));
  }, [dispatch, token, isLoaded]);

  const handleSaveToggle = async (id, isSaved) => {
    if (!token) {
      toast.error("Avval login qiling");
      return;
    }

    try {
      if (isSaved) {
        const res = await dispatch(unsaveElon({ id, token }));
        console.log("unsaveElon result:", res);
        if (res?.meta?.requestStatus === "fulfilled") {
          toast.success("E'lon saqlandi bekor qilindi");
        } else {
          toast.error(res?.payload?.message || "Bekor qilishda xatolik");
        }
      } else {
        const res = await dispatch(saveElon({ id, token }));
        console.log("saveElon result:", res);
        if (res?.meta?.requestStatus === "fulfilled") {
          toast.success("E'lon saqlandi");
          // Refresh saved list to ensure consistent shape
          dispatch(fetchSavedElons(token));
        } else {
          toast.error(res?.payload?.message || "Saqlashda xatolik");
        }
      }
    } catch (err) {
      console.error("save/unsave error:", err);
      toast.error("Xatolik yuz berdi");
    }
  };

  if (loading) return <Loader />;
  if (elonlar.length === 0) return <p>E’lonlar topilmadi.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {elonlar.map((item) => {
        const isSaved = Array.isArray(savedElons) && savedElons.some((s) => s._id === item._id);

        return (
          <Card
            key={item._id}
            id={item._id}
            ownerId={item.user._id}
            image={item.image}
            title={item.title}
            price={item.price}
            location={item.location}
            rooms={item.rooms}
            area={item.area}
            status={item.status}
            postedDate={item.createdAt}
            user={user}
            onSave={() => handleSaveToggle(item._id, isSaved)}
            isSaved={isSaved}
          />
        );
      })}
    </div>
  );
};

export default CardsList;
