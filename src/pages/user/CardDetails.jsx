import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchElonById } from "../../redux/elonSlice";
import Loader from "../../components/Loader";

const CardDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { currentElon, currentLoading, currentError } = useSelector((state) => state.elon);

  useEffect(() => {
    if (!id) return;
    if (!currentElon || currentElon._id !== id) {
      dispatch(fetchElonById(id));
    }
  }, [dispatch, id, currentElon]);

  if (currentLoading)
    return (
      <div className="p-10 text-center text-lg">
        <Loader />
      </div>
    );

  if (currentError)
    return <div className="p-10 text-center text-red-500">Xatolik: {currentError}</div>;

  if (!currentElon) return <div className="p-10 text-center text-red-500">E'lon topilmadi</div>;

  return (
    <div className="w-full mx-auto mt-4 p-6 dark:bg-zinc-700 bg-zinc-300 rounded-lg shadow-md grid gap-4 grid-cols-2 ">
      <img src={currentElon.image} alt={currentElon.title} className="rounded-md mb-4" />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2">{currentElon.title}</h1>
        <p className="mb-2">Joylashuv: {currentElon.location}</p>
        <p className="mb-2">Maydon: {currentElon.area} m²</p>
        <p className="mb-2">Xonalar: {currentElon.rooms} ta</p>
        <p className="text-xl font-bold mt-4">${currentElon.price}</p>
        <p className="mt-4">{currentElon.description}</p>
      </div>
    </div>
  );
};

export default CardDetails;
