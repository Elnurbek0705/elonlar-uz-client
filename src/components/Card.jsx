import React from "react";
import { Pencil, Trash2, Heart } from "lucide-react";
import { NavLink } from "react-router-dom";

const Card = ({
  id,
  image,
  title,
  price,
  location,
  rooms,
  area,
  status,
  postedDate,
  user,
  onDelete,
  onEdit,
  onSave,
  isSaved,
}) => {
  const isAdmin = user?.role === "admin";

  return (
    <div className="bg-zinc-300 dark:bg-zinc-700 rounded-lg overflow-hidden hover:shadow-lg shadow-md transition-shadow duration-300 inset-shadow-sm inset-shadow-zinc-900">
      <img src={image} alt={title} className="w-full h-48 object-cover" />

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
          {title}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-between">
          <span>{location}</span>
          <span className="text-nowrap">{area} m²</span>
        </p>

        <div className="flex items-center justify-between">
          <span className="text-zinc-700 dark:text-zinc-300 text-sm">{rooms} xonali</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">${price}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mt-1">
          <span>{status || "Kelishilgan"}</span>
          <span>{new Date(postedDate).toLocaleDateString()}</span>
        </div>

        {!isAdmin && (
          <div className="flex flex-row gap-2 mt-2">
            <button className="w-full hover:bg-zinc-500 dark:bg-zinc-600 bg-zinc-400 cursor-pointer py-2 rounded-md">
              <NavLink to={`/cards/${id}`} className="text-white block">
                Batafsil
              </NavLink>
            </button>

            <button onClick={() => onSave(id)} className="rounded-md px-2">
              <Heart size={30} className={isSaved ? "text-red-600" : "text-pink-500"} />
            </button>
          </div>
        )}

        {isAdmin && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onEdit(id)}
              className="flex-1 flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
            >
              <Pencil size={16} /> Tahrirlash
            </button>
            <button
              onClick={() => onDelete(id)}
              className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
            >
              <Trash2 size={16} /> O‘chirish
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
