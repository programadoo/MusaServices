// ...otros imports
import { useContext, useState } from "react";
import { EcommerceContext } from "../shared/context/ecommerceContext";
import SizeButtons from "../shared/components/infoProducts/SizeButtons";
import PaypalButtonComponent from "../shared/components/Paypal/PaypalButtonComponent";

const InfoProducts = () => {
  const context = useContext(EcommerceContext) as any;
  const { initState, handleSize } = context;
  const [initCounter, setInitCounter] = useState<number>(0);
  const handleInitCounter = () => {
    setInitCounter(1);
  };
  const product = localStorage.getItem("productSelected");
  const selectedProduct = product !== null ? JSON.parse(product) : null;
  return (
    <div className="bg-gray-50 font-sans w-screen">
      <div className="min-h-screen py-12 pr-4 pl-4 sm:pt-20 mr-7">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start">
            {/* ... */}
            <div className="w-full md:w-1/2">
              <div className="aspect-square rounded-xl bg-gray-100 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl relative group">
                <img
                  src={selectedProduct?.image}
                  alt="Product Image"
                  className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs font-medium">
                  NUEVO
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 space-y-8">
              <div>
                <div className="flex items-center space-x-2 text-sm mb-3">
                  <span className="text-gray-500 uppercase tracking-wide">
                    Colección Primavera
                  </span>
                  <span className="text-gray-300">|</span>
                  <div className="flex items-center text-yellow-400">
                    {/* SVG estrellas ejemplo */}
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-gray-500 text-xs ml-1">
                      (24 reseñas)
                    </span>
                  </div>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                  {selectedProduct?.name}
                </h1>
                <p className="text-gray-500 mt-4 leading-relaxed">
                  {selectedProduct?.description}
                </p>
              </div>

              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-500">Tallas:</span>
                  <div className="flex space-x-2">
                    {initCounter === 0 ? (
                      <>
                        <button
                          onClick={() => {
                            handleSize("XS");
                            handleInitCounter();
                          }}
                          className="px-2 py-1  text-black border-gray-300 rounded-md text-sm hover:border-black"
                        >
                          XS
                        </button>
                        <button
                          onClick={() => {
                            handleSize("S");
                            handleInitCounter();
                          }}
                          className="px-2 py-1 text-black border border-gray-300 rounded-md text-sm hover:border-black"
                        >
                          S
                        </button>
                        <button
                          onClick={() => {
                            handleSize("M");
                            handleInitCounter();
                          }}
                          className="px-2 py-1 bg-black text-white border-black rounded-md text-sm"
                        >
                          M
                        </button>
                        <button
                          onClick={() => {
                            handleSize("L");
                            handleInitCounter();
                          }}
                          className="px-2 py-1 text-black border-gray-300 rounded-md text-sm hover:border-black"
                        >
                          L
                        </button>
                        <button
                          onClick={() => {
                            handleSize("XL");
                            handleInitCounter();
                          }}
                          className="px-2 py-1 text-black border-gray-300 rounded-md text-sm hover:border-black"
                        >
                          XL
                        </button>
                      </>
                    ) : (
                      <SizeButtons />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 py-4 border-t border-b border-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-600">Stock disponible:</span>
                <span id="stock" className="font-semibold text-gray-900">
                  10
                </span>
                <span className="text-gray-600">unidades</span>
              </div>

              <div className="flex items-baseline space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${selectedProduct?.price}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${(selectedProduct?.price + 100.99).toFixed(2)}
                </span>
                <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-md">
                  -25%
                </span>
              </div>

              <div className="pt-2 space-y-4">
                <button
                  id="buyButton"
                  className="w-full px-6 py-4 text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 rounded-md transition duration-200 ease-in-out transform hover:translate-y-[-2px]"
                >
                  Agregar al Carrito
                </button>
                <PaypalButtonComponent />

                <div className="flex space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Envío en 24h</span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span>Compra segura</span>
                  </div>
                </div>
              </div>
            </div>
            {/* ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoProducts;
