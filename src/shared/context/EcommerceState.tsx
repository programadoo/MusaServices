import { ReactNode, useState } from "react";
import { EcommerceContext } from "./ecommerceContext";
import { Product } from "../models/product.modul";
const EcommerceState = ({ children }: { children: ReactNode }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [initState, setInitState] = useState([
    {
      name: "Abrigo Elegante",
      price: 129.99,
      description:
        "Abrigo elegante con capucha y bolsillos ideal para temporada de invierno",
      quantity: 15,
      image: "src/assets/images/abrigo_marron.png",
      selected: false,
      stars: 4,
      reviews: 15,
    },

    {
      name: "Vestido de Boda",
      price: 400.65,
      description: "Vestido de boda para ocasiones importantes y únicas",
      quantity: 6,
      image: "src/assets/images/vestido_blanco.png",
      selected: false,
      stars: 5,
      reviews: 31,
    },

    {
      name: "Vestido Azul de Gala",
      price: 100.1,
      description: "Vestido de gala para festejos de etiqueta",
      quantity: 8,
      image: "src/assets/images/vestido_azul.png",
      selected: false,
      stars: 4,
      reviews: 23,
    },

    {
      name: "Jeans Casuales",
      price: 29.99,
      description: "Jeans casuales con diseño moderno y confortable",
      quantity: 55,
      image: "src/assets/images/jeans_dama.png",
      selected: false,
      stars: 5,
      reviews: 25,
    },

    {
      name: "Blusa CH",
      price: 135.5,
      description: "Blusa de Carolina Herrera para la temporada de primavera",
      quantity: 17,
      image: "src/assets/images/blusa_blanca.png",
      selected: false,
      stars: 3,
      reviews: 5,
    },

    {
      name: "Chaqueta Verde Versage",
      price: 95.2,
      description:
        "Chaqueta verde de Versage para la temporada de invierno y salidas casuales",
      quantity: 9,
      image: "src/assets/images/chaqueta_verde.png",
      selected: false,
      stars: 4,
      reviews: 17,
    },

    {
      name: "Top Rosado Casual",
      price: 20.0,
      description:
        "Top rosado con diseño casual y confortable para el uso diario en la casa",
      quantity: 67,
      image: "src/assets/images/top_rosado.png",
      selected: false,
      stars: 4,
      reviews: 35,
    },
  ] as Product[]);

  const [selectedSize, setSelectedSize] = useState<string>();

  const handleSize = (size: string) => {
    setSelectedSize(size);
  };
  const handlerQuantityProductStore = (nameProduct: string) => {
    const indexProduct = initState.findIndex(
      (product) => product.name === nameProduct
    );
    setInitState((prevState) => {
      const newState = [...prevState];
      newState[indexProduct].quantity -= 1;
      return newState;
    });
  };

  const handleSelectedState = (nameProduct: string) => {
    console.log(nameProduct);
    const indexProduct = initState.findIndex(
      (product) => product.name === nameProduct
    );
    setInitState((prevState) => {
      const newState = [...prevState];
      newState[indexProduct].selected = !newState[indexProduct].selected;
      localStorage.setItem(
        "productSelected",
        JSON.stringify(newState[indexProduct])
      );
      return newState;
    });
  };
  return (
    <EcommerceContext.Provider
      value={{
        initState,
        handlerQuantityProductStore,
        handleSelectedState,
        selectedSize,
        handleSize,
      }}
    >
      {children}
    </EcommerceContext.Provider>
  );
};

export default EcommerceState;
