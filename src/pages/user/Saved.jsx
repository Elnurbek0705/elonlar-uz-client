import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSavedElons, unsaveElon } from "../../redux/elonSlice";
import Card from "../../components/Card";

const SavedPage = () => {
  const dispatch = useDispatch();
  const { savedElons, savedLoaded, loading } = useSelector(
    (state) => state.elon
  );

  // Use Redux store as the single source of truth for the current user and token
  const userInfo = useSelector((state) => state.user.userInfo);
  const user = userInfo?.user;
  const token = userInfo?.token ?? localStorage.getItem("token");

  useEffect(() => {
if (token && !savedLoaded) {
  dispatch(fetchSavedElons(token));
}

  }, [dispatch, token, savedLoaded]);

  if (loading && !savedLoaded)
    return <p className="text-center">Yuklanmoqda...</p>;

  if (savedElons.length === 0)
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
          onSave={() =>
            dispatch(unsaveElon({ id: item._id, token }))
          }
          isSaved={true}
          showOwnerActions={false}
        />
      ))}
    </div>
  );
};

export default SavedPage;
