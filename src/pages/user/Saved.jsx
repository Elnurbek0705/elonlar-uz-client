import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSavedElons } from "../../redux/elonSlice";
import Card from "../../components/Card";

const SavedPage = () => {
  const dispatch = useDispatch();
  const { savedElons, savedLoaded, loading } = useSelector(
    (state) => state.elon
   );
    console.log("Saved elons:", savedElons);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  
  dispatch(fetchSavedElons(token)).then((res) => console.log("Fetch result:", res));

  useEffect(() => {
    if (!savedLoaded && token) {
      dispatch(fetchSavedElons(token));
    }
  }, [dispatch, savedLoaded, token]);

  if (loading && !savedLoaded)
    return <p className="text-center">Yuklanmoqda...</p>;

  if ((savedElons?.length ?? 0) === 0)
    return <p className="text-center">Hech narsa saqlanmagan.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {savedElons.map((item) => (
        <Card
          key={item._id}
          id={item._id}
          image={item.image}
          title={item.title}
          price={item.price}
          location={item.location}
          rooms={item.rooms}
          area={item.area}
          status={item.status}
          postedDate={item.createdAt}
          user={user}
          onDelete={() => {}}
          onEdit={() => {}}
          onSave={() => {}}
        />
      ))}
    </div>
  );
};

export default SavedPage;
