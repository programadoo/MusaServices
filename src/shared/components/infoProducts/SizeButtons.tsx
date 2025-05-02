import { useState, useContext } from "react";
import { EcommerceContext } from "../../context/ecommerceContext";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
interface SizeI {
  size: string;
  bg: string;
  text_color: string;
  bg1: string;
  text_color1: string;
}
const SizeButtons = () => {
  const { selectedSize, handleSize } = useContext(EcommerceContext);
  const [selectedSizeBtn, setSelectedSizeBtn] = useState<SizeI[]>([
    {
      size: "XS",
      bg: "bg-black",
      text_color: "text-white",
      bg1: "bg-white",
      text_color1: "text-black",
    },
    {
      size: "S",
      bg: "bg-black",
      text_color: "text-white",
      bg1: "bg-white",
      text_color1: "text-black",
    },
    {
      size: "M",
      bg: "bg-black",
      text_color: "text-white",
      bg1: "bg-white",
      text_color1: "text-black",
    },
    {
      size: "L",
      bg: "bg-black",
      text_color: "text-white",
      bg1: "bg-white",
      text_color1: "text-black",
    },
    {
      size: "XL",
      bg: "bg-black",
      text_color: "text-white",
      bg1: "bg-white",
      text_color1: "text-black",
    },
  ]);
  return selectedSizeBtn.map((element: SizeI) =>
    element.size === selectedSize ? (
      <button
        onClick={() => handleSize(element.size)}
        className="px-2 py-1  text-white  bg-black rounded-md text-sm"
      >
        {element.size}
      </button>
    ) : (
      <button
        onClick={() => handleSize(element.size)}
        className="px-2 py-1  text-black bg-gray-100 border-gray-300 rounded-md text-sm hover:border-black"
      >
        {element.size}
      </button>
    )
  );
};

export default SizeButtons;
