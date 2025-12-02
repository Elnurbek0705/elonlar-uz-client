import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CardDetails = () => {
  const { id } = useParams(); // URL dan ID ni olish
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/elons/${id}`);
        setData(res.data);
      } catch (err) {
        console.error("Xatolik:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="p-10 text-center text-lg">Yuklanmoqda...</div>;
  if (!data) return <div className="p-10 text-center text-red-500">E'lon topilmadi</div>;

  return (
    <div className="max-w-3xl mx-auto mt-4 p-6 dark:bg-zinc-700 bg-zinc-300 inset-shadow-sm inset-shadow-zinc-500 rounded-lg shadow-md">
      <img src={data.image} alt={data.title} className="w-full rounded-md mb-4" />
      <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
      <p className="mb-2">Joylashuv: {data.location}</p>
      <p className="mb-2">Maydon: {data.area} m²</p>
      <p className="mb-2">Xonalar: {data.rooms} ta</p>
      <p className="text-xl font-bold mt-4">${data.price}</p>
      <p className="mt-4">{data.description}</p>
    </div>
  );
};

export default CardDetails;
