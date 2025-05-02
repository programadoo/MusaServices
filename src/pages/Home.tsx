import CardProduct from "../shared/components/CardProduct/CardProduct";
import { useContext, useEffect, useState } from "react";
import { EcommerceContext } from "../shared/context/ecommerceContext";
import { Product } from "../shared/models/product.modul";

const Home = () => {
  const { initState } = useContext(EcommerceContext);
  const arrProducts: Product[] = initState;
  const [reloadFlag, setReloadFlag] = useState(false);
  useEffect(() => {
    // Función que se ejecuta en recarga o volver a la página
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Si la página viene del cache del navegador (back/forward)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setReloadFlag((prev: any) => !prev); // Cambia el estado para forzar render
      }
    };

    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);
  return (
    <>
      <nav className="bg-white shadow-lg fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-gray-800">
                FASHION<span className="text-pink-500">HUB</span>
              </a>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className="text-gray-600 hover:text-pink-500 transition"
              >
                Home
              </a>
              <a
                href="/about"
                className="text-gray-600 hover:text-pink-500 transition"
              >
                About Us
              </a>
            </div>
            <div className="md:hidden flex items-center">
              <button className="text-gray-600">
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="w-screen pt-20 pb-12 bg-gradient-to-r from-pink-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Discover Your Style
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Explore our curated collection of premium fashion items designed
              for the modern individual.
            </p>
          </div>
        </div>
      </section>

      <section className="w-screen  mx-auto  px-4   sm:px-6 lg:px-8 py-12 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {arrProducts.map((product, index) => (
            <CardProduct
              key={index}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>
      </section>

      <section className="bg-pink-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Stay Updated</h2>
            <p className="mt-2 text-gray-600">
              Subscribe to our newsletter for the latest trends and exclusive
              offers.
            </p>
            <div className="mt-6 max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">FASHIONHUB</h3>
              <p className="text-gray-400">
                Your premier destination for modern fashion and accessories.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-gray-400 hover:text-white transition"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/products"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Products
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@fashionhub.com</li>
                <li>Phone: (555) 123-4567</li>
                <li>Address: 123 Fashion Street</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FASHIONHUB. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
