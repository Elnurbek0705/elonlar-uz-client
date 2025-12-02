import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../../components/Card";

const SavedPage = () => {
  const [savedElons, setSavedElons] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchSavedElons = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/saved-elons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedElons(res.data);
    } catch (err) {
      console.error("Saqlangan e’lonlarni olishda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedElons();
  }, []);

  if (loading) return <p className="text-center">Yuklanmoqda...</p>;
  if (savedElons.length === 0) return <p className="text-center">Hech narsa saqlanmagan.</p>;

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
