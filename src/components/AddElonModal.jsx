import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ModalWrapper from "../components/ModalWrapper";

const AddElonModal = ({ isOpen, onClose, onCreated, editData }) => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    location: "",
    rooms: "",
    area: "",
    floor: "",
    furnished: false,
    image: null,
    description: "",
    status: "Faol",
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useSelector((state) => state.user);

  
  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || "",
        price: editData.price || "",
        location: editData.location || "",
        rooms: editData.rooms || "",
        area: editData.area || "",
        floor: editData.floor || "",
        furnished: !!editData.furnished,
        image: null,
        description: editData.description || "",
        status: editData.status || "Faol",
      });
      setPreview(editData.image || null);
    } else {
      setForm({
        title: "",
        price: "",
        location: "",
        rooms: "",
        area: "",
        floor: "",
        furnished: false,
        image: null,
        description: "",
        status: "Faol",
      });
      setPreview(null);
    }
  }, [editData]);

  // 🔧 input o‘zgarishlari
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, image: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  // 📤 e’lonni jo‘natish
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo?.token) return alert("Tizimga kirmagansiz!");

    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) formData.append(key, value);
      });

      const headers = {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "multipart/form-data",
      };

      if (editData) {
        await axios.put(`http://localhost:5000/api/elonlar/${editData._id}`, formData, { headers });
      } else {
        await axios.post("http://localhost:5000/api/elonlar", formData, { headers });
      }

      onCreated?.();
      onClose();
    } catch (err) {
      console.error("E’lonni saqlashda xatolik:", err.response?.data || err.message);
      alert(err.response?.data?.error || "E’lonni saqlashda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  // ❌ agar modal ochilmagan bo‘lsa — hech narsa render qilinmaydi
  if (!isOpen) return null;

  return (
    <ModalWrapper> {/* 🧩 endi ModalWrapper ichida barcha kontent */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 w-full md:w-[480px] relative shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-center mb-4">
          {editData ? "E’lonni tahrirlash" : "Yangi e’lon qo‘shish"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Sarlavha */}
          <div>
            <label className="block mb-1 text-sm font-medium">Sarlavha *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="border p-2 rounded w-full dark:bg-zinc-700 dark:text-white"
              required
            />
          </div>

          {/* Narx */}
          <div>
            <label className="block mb-1 text-sm font-medium">Narx ($) *</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="border p-2 rounded w-full dark:bg-zinc-700 dark:text-white"
              required
            />
          </div>

          {/* Joylashuv */}
          <div>
            <label className="block mb-1 text-sm font-medium">Joylashuv *</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="border p-2 rounded w-full dark:bg-zinc-700 dark:text-white"
              required
            />
          </div>

          {/* Xonalar va maydon */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm font-medium">Xonalar *</label>
              <input
                type="number"
                name="rooms"
                value={form.rooms}
                onChange={handleChange}
                className="border p-2 rounded w-full dark:bg-zinc-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Maydon (m²) *</label>
              <input
                type="number"
                name="area"
                value={form.area}
                onChange={handleChange}
                className="border p-2 rounded w-full dark:bg-zinc-700 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Qavat */}
          <div>
            <label className="block mb-1 text-sm font-medium">Qavat</label>
            <input
              type="number"
              name="floor"
              value={form.floor}
              onChange={handleChange}
              className="border p-2 rounded w-full dark:bg-zinc-700 dark:text-white"
            />
          </div>

          {/* Holati */}
          <div>
            <label className="block mb-1 text-sm font-medium">Holati *</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border p-2 rounded w-full dark:bg-zinc-700 dark:text-white"
            >
              <option value="Faol">Faol</option>
              <option value="Kelishilgan">Kelishilgan</option>
            </select>
          </div>

          {/* Mebelli */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="furnished"
              checked={form.furnished}
              onChange={handleChange}
            />
            <label className="text-sm font-medium">Mebelli</label>
          </div>

          {/* Rasm */}
          <div>
            <label className="block mb-1 text-sm font-medium">Rasm yuklang *</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="border p-2 rounded w-full dark:bg-zinc-700 dark:text-white"
              required={!editData}
            />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-full h-40 object-cover rounded-md mt-2"
              />
            )}
          </div>

          {/* Tavsif */}
          <div>
            <label className="block mb-1 text-sm font-medium">Qo‘shimcha ma’lumot *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="border p-2 rounded w-full resize-none dark:bg-zinc-700 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          >
            {loading ? "Saqlanmoqda..." : editData ? "O‘zgartirishni saqlash" : "E’lonni joylash"}
          </button>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default AddElonModal;
