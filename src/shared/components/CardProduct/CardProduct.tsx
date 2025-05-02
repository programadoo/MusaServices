import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { EcommerceContext } from "../../context/ecommerceContext";
interface Product {
  name: string;
  price: number;
  image?: string;
}

//import { useNavigate } from "react-router-dom";
const CardProduct = ({ name, price, image }: Product) => {
  const navigate = useNavigate();
  const { handleSelectedState } = useContext(EcommerceContext);
  const handleQuickPreview = () => {
    /* window.open("https://a543e114fbf8fade28.gradio.live/"); */
    window.open(
      "https://huggingface.co/spaces/Kwai-Kolors/Kolors-Virtual-Try-On"
    );
  };

  const handleCustomPreview = () => {
    window.open("https://a543e114fbf8fade28.gradio.live/");
  };

  const redirect = () => {
    handleSelectedState(name);
    navigate("/info");
  };
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
      <div className="relative pb-[2%]">
        <div className="relative w-full h-[330px] inset-0 bg-gray-200  flex items-center justify-center">
          {image !== undefined ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-contain"
            />
          ) : (
            <svg
              className="h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-gray-500 mt-1">${price}</p>
        <button
          onClick={redirect}
          className="mt-4 w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition"
        >
          Add to Cart
        </button>
        <div className="w-full h-auto flex justify-around flex-nowrap gap-6">
          <button
            className="mt-4 w-full bg-gray-400 text-white py-2 rounded-md hover:bg-gray-600 transition"
            onClick={handleQuickPreview}
          >
            Vista Rápida
          </button>
          <button
            className="mt-4 w-full bg-slate-800 text-white py-2 rounded-md hover:bg-slate-700 transition"
            onClick={handleCustomPreview}
          >
            Personalizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
