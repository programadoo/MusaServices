import { ReactNode, useState } from "react";
import { EcommerceContext } from "./ecommerceContext";
import { Product } from "../models/product.modul";
const EcommerceState = ({ children }: { children: ReactNode }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [initState, setInitState] = useState([
    {
      name: "Proud",
      price: 129.99,
      description:
        "",
      quantity: 15,
      image: "src/assets/images/proud.jpeg",
      aiImage: "src/assets/images/proud_final.png",
      selected: false,
      stars: 4,
      reviews: 15,
      aiCategory: "dresses", // Ejemplo
      aiDescription: "A taupe tailored double-breasted vest and matching wide-leg trousers, formal office wear",
    },

    {
      name: "Monalisa",
      price: 400.65,
      description: "",
      quantity: 6,
      image: "src/assets/images/monalisa.jpeg",
      aiImage: "src/assets/images/monalisa_final.png",
      selected: false,
      stars: 5,
      reviews: 31,
      aiCategory: "dresses", // Ejemplo
      aiDescription: "A brown linen off-the-shoulder jumpsuit with a wide-leg cut, elegant and textured",
    },

    {
      name: "Giallo",
      price: 100.1,
      description: "",
      quantity: 8,
      image: "src/assets/images/giallo.jpeg",
      aiImage: "src/assets/images/giallo_final.png",
      selected: false,
      stars: 4,
      reviews: 23,
      aiCategory: "dresses", // Ejemplo
      aiDescription: "A beige halter-neck jumpsuit with a square neckline and prominent utility pockets on the thighs, slim fit",
    },

    {
      name: "Expensive",
      price: 29.99,
      description: "",
      quantity: 55,
      image: "src/assets/images/expensive.jpeg",
      aiImage: "src/assets/images/expensive_final.png",
      selected: false,
      stars: 5,
      reviews: 25,
      aiCategory: "dresses", // Ejemplo
      aiDescription: "A white structured asymmetric blazer with a high-neck scarf detail and wide-leg tailored trousers, couture style",
    },

    {
      name: "Classic",
      price: 135.5,
      description: "",
      quantity: 17,
      image: "src/assets/images/classic.jpeg",
      aiImage: "src/assets/images/clasic_final.png",
      selected: false,
      stars: 3,
      reviews: 5,
      aiCategory: "dresses", // Ejemplo
      aiDescription: "A cream-colored tailored vest and matching wide-leg trousers, formal style",
    },

    {
      name: "Musa",
      price: 95.2,
      description:
        "",
      quantity: 9,
      image: "src/assets/images/musa.jpeg",
      aiImage: "src/assets/images/musa_final.png",
      selected: false,
      stars: 4,
      reviews: 17,
      aiCategory: "dresses", // Ejemplo
      aiDescription: "A white strapless jumpsuit with a black belt and a straight-leg cut",
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
