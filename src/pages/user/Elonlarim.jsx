import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ConfirmModal from "../../components/ConfirmModal";
import AddElonModal from "../../components/AddElonModal";

const Elonlarim = () => {
  const [elonlar, setElonlar] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { userInfo } = useSelector((state) => state.user);

  const fetchElonlar = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/elons/my", {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });
      setElonlar(res.data);
    } catch (err) {
      console.error("Elonlarni olishda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElonlar();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/elonlar/${deleteId}`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      setElonlar((prev) => prev.filter((elon) => elon._id !== deleteId));
    } catch (err) {
      console.error("E’lonni o‘chirishda xatolik:", err);
    } finally {
      setConfirmOpen(false);
    }
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          ➕ Yangi e’lon
        </button>
      </div>

      {loading ? (
        <p className="text-center text-zinc-500">Yuklanmoqda...</p>
      ) : elonlar.length === 0 ? (
        <p className="text-center text-zinc-500">Hozircha hech qanday e’lon yo‘q.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {elonlar.map((elon) => (
            <div
              key={elon._id}
              className="relative dark:bg-zinc-700 bg-zinc-300 inset-shadow-sm inset-shadow-zinc-500 rounded-lg shadow-md p-4"
            >
              <img
                src={elon.image || "https://via.placeholder.com/300"}
                alt={elon.title}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
              <h3 className="text-lg font-semibold mb-1">{elon.title}</h3>
              <p className="text-sm text-zinc-500">{elon.location}</p>
              <p className="text-blue-600 font-bold mt-2">{elon.price}$</p>

              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => {
                    setEditData(elon);
                    setModalOpen(true);
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-2 py-1 rounded"
                >
                  ✏️
                </button>
                <button
                  onClick={() => {
                    setDeleteId(elon._id);
                    setConfirmOpen(true);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddElonModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={fetchElonlar}
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
