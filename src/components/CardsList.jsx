import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "./Card";
import { fetchElonlar, fetchSavedElons, saveElon, deleteElon } from "./../redux/elonSlice";
import Loader from "./Loader";

const CardsList = () => {
  const dispatch = useDispatch();
  const { elonlar, savedElons, loading, isLoaded } = useSelector((state) => state.elon);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  console.log(elonlar);
  
  

  useEffect(() => {
    if (!isLoaded) {
      dispatch(fetchElonlar());
    }
    dispatch(fetchSavedElons(token));
  }, [dispatch, token, isLoaded]);

  const handleSave = (id) => {
    dispatch(saveElon({ id, token }));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bu e’lonni o‘chirmoqchimisiz?")) return;
    dispatch(deleteElon({ id, token }));
  };

  if (loading) return <Loader />;
  if (elonlar.length === 0) return <p>E’lonlar topilmadi.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {elonlar.map((item) => (
        <Card
          key={item._id}
          id={item._id}
          ownerId={item.user._id} // backend’dan kelayotgan e’lon egasi id
          image={item.image}
          title={item.title}
          price={item.price}
          location={item.location}
          rooms={item.rooms}
          area={item.area}
          status={item.status}
          postedDate={item.createdAt}
          user={user}
          onDelete={handleDelete}
          onSave={handleSave}
          isSaved={savedElons?.includes(item._id)}
        />
      ))}
    </div>
  );
};

export default CardsList;
