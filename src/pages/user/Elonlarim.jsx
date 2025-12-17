import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyElons, deleteElon } from "../../redux/elonSlice";
import ConfirmModal from "../../components/ConfirmModal";
import AddElonModal from "../../components/AddElonModal";
import Card from "../../components/Card";
import Loader from "../../components/Loader";

const Elonlarim = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { myElons, myLoaded, loading } = useSelector((state) => state.elon);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // 🔹 Request faqat birinchi marta yuboriladi
  useEffect(() => {
    if (!myLoaded && userInfo?.token) {
      dispatch(fetchMyElons(userInfo.token));
    }
  }, [dispatch, myLoaded, userInfo?.token]);

  // 🔹 E’lonni o‘chirish
  const handleDelete = () => {
    if (!deleteId || !userInfo?.token) return;
    dispatch(deleteElon({ id: deleteId, token: userInfo.token }));
    setConfirmOpen(false);
  };

  // 🔹 Edit modal uchun
  const handleEdit = (id) => {
    const selected = myElons.find((e) => e._id === id);
    setEditData(selected);
    setModalOpen(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mening e’lonlarim</h2>
        <button
          onClick={() => {
            setEditData(null);
            setModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          ➕ Yangi e’lon
        </button>
      </div>

      {loading && !myLoaded ? (
        <Loader />
      ) : myElons.length === 0 ? (
        <p className="text-center text-zinc-500">Hozircha hech qanday e’lon yo‘q.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myElons.map((elon) => (
            <Card
          key={elon._id}
          id={elon._id}
          image={elon.image}
          title={elon.title}
          price={elon.price}
          location={elon.location}
          rooms={elon.rooms}
          area={elon.area}
          status={elon.status}
          postedDate={elon.createdAt}
        />
          ))}
        </div>
      )}

      <AddElonModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => dispatch(fetchMyElons(userInfo.token))}
        editData={editData}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        title="E’lonni o‘chirish"
        message="Bu e’lonni o‘chirmoqchimisiz?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default Elonlarim;
