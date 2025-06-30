import CardProduct from "../shared/components/CardProduct/CardProduct";
import { useContext, useEffect, useState } from "react";
import { EcommerceContext } from "../shared/context/ecommerceContext";
import { Product } from "../shared/models/product.modul";
import "../assets/styles/style.css";

const Home = () => {
  const context = useContext(EcommerceContext) as any;
  const arrProducts: Product[] = context?.initState || [];
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
      <nav className="bg-white shadow-lg fixed w-full z-50 h-24">
        <div className="w-full mx-auto px-4">
          <div className="flex justify-around items-center h-20 relative gap-6">
            <div className="flex items-center w-[28%] mr-16 h-24 relative">
              <img
                src="src/assets/images/logo.jpeg"
                alt="Logo"
                className="object-contain w-48 h-full rounded-lg mt-4"
              />
            </div>
            <div className="flex items-center relative w-[50%] h-24">
              <a href="/" className="text-3xl font-bold text-gray-800 mt-4">
                <span className="text-pink-500">BACO</span>VACH
              </a>
            </div>

            {/* <div className="hidden md:flex items-center space-x-8">
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
            </div> */}
            <div className="md:hidden flex items-center">
              <button className="text-gray-600">
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="section_container w-screen pt-20 pb-12 bg-gradient-to-r from-pink-50 to-gray-50 hero-animation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Descubre tu Estilo
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Explora nuestra colección de artículos de moda premium, diseñados
              para la persona moderna.
            </p>
          </div>
        </div>
      </section>

      {/* Nueva sección: Trending Styles */}
      <section className="section_container w-screen mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Estilos de tendencia
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubre las últimas tendencias que están dominando la escena de
              la moda este año. Desde estilos minimalistas hasta looks audaces,
              tenemos todo lo que necesitas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center fade-left">
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg p-8 mb-6">
                <div className="w-16 h-16 bg-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-star text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Minimalismo Elegante
                </h3>
                <p className="text-gray-600">
                  Estilos limpios y sofisticados que nunca pasan de moda.
                  Perfectos para cualquier ocasión.
                </p>
              </div>
            </div>

            <div className="text-center fade-up">
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-8 mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-fire text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Estilo callejero
                </h3>
                <p className="text-gray-600">
                  Looks urbanos y modernos que combinan comodidad con estilo.
                  Ideal para el día a día.
                </p>
              </div>
            </div>

            <div className="text-center fade-right">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-8 mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-gem text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Lujo Accesible
                </h3>
                <p className="text-gray-600">
                  Diseños premium a precios accesibles. Calidad excepcional sin
                  comprometer tu presupuesto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nueva sección: Seasonal Collection */}
      <section className="section_container w-screen mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Colección de Temporada
              </h2>
              <p className="text-gray-600 mb-6">
                Nuestra nueva colección de temporada combina los colores más
                vibrantes con tejidos de la más alta calidad. Cada pieza está
                diseñada pensando en la mujer moderna que busca elegancia y
                comodidad.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-pink-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    Tejidos premium y sostenibles
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    Diseños únicos y exclusivos
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    Perfecto para cualquier ocasión
                  </span>
                </div>
              </div>
              <button className="mt-8 bg-pink-500 text-white px-8 py-3 rounded-lg hover:bg-pink-600 transition duration-300">
                Explorar Colección
              </button>
            </div>

            <div className="fade-right">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="w-full h-32 bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg mb-3 relative">
                      <img
                        src="src/assets/images/moda1.jpg"
                        alt="Vestido de Gala"
                        className="object-fill w-full h-full rounded-lg"
                      />
                    </div>
                    <h4 className="font-semibold text-gray-900">
                      Vestidos de Gala
                    </h4>
                    <p className="text-sm text-gray-600">
                      Elegantes y sofisticados
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="w-full h-32 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-lg mb-3 relative">
                      <img
                        src="src/assets/images/moda2.jpg"
                        alt="Vestido de Gala"
                        className="object-fill w-full h-full rounded-lg"
                      />
                    </div>
                    <h4 className="font-semibold text-gray-900">Ropa Casual</h4>
                    <p className="text-sm text-gray-600">Cómoda y moderna</p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="w-full h-32 bg-gradient-to-br from-green-200 to-emerald-200 rounded-lg mb-3 relative">
                      <img
                        src="src/assets/images/accesorios.jpg"
                        alt="Vestido de Gala"
                        className="object-fill w-full h-full rounded-lg"
                      />
                    </div>
                    <h4 className="font-semibold text-gray-900">Accesorios</h4>
                    <p className="text-sm text-gray-600">Completa tu look</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-lg">
                    <div className="w-full h-32 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-lg mb-3 relative">
                      <img
                        src="src/assets/images/zapatos.jpg"
                        alt="Vestido de Gala"
                        className="object-fill w-full h-full rounded-lg"
                      />
                    </div>
                    <h4 className="font-semibold text-gray-900">Zapatos</h4>
                    <p className="text-sm text-gray-600">Estilo y confort</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nueva sección: Fashion Tips */}
      <section className="section_container w-screen mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Consejos de Moda
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubre cómo crear looks increíbles con nuestros expertos
              consejos de styling
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center fade-left">
              <div className="bg-gray-50 rounded-lg p-6 h-full">
                <div className="w-12 h-12 bg-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-palette text-white"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Teoría de colores
                </h3>
                <p className="text-gray-600 text-sm">
                  Aprende a combinar colores para crear looks armoniosos y
                  llamativos
                </p>
              </div>
            </div>

            <div className="text-center fade-up">
              <div className="bg-gray-50 rounded-lg p-6 h-full">
                <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-tshirt text-white"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Capas
                </h3>
                <p className="text-gray-600 text-sm">
                  Técnicas para crear looks por capas elegantes y funcionales
                </p>
              </div>
            </div>

            <div className="text-center fade-up">
              <div className="bg-gray-50 rounded-lg p-6 h-full">
                <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-gem text-white"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Accesorios
                </h3>
                <p className="text-gray-600 text-sm">
                  Cómo elegir y combinar accesorios para elevar cualquier outfit
                </p>
              </div>
            </div>

            <div className="text-center fade-right">
              <div className="bg-gray-50 rounded-lg p-6 h-full">
                <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-magic text-white"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Transformación de estilo
                </h3>
                <p className="text-gray-600 text-sm">
                  Transforma tu guardarropa con piezas versátiles y atemporales
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section_container w-screen mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Productos destacados
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

      {/* Nueva sección: Customer Reviews */}
      <section className="section_container w-screen mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubre por qué miles de clientes confían en FASHIONHUB para su
              estilo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-lg fade-left">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-pink-200 rounded-full mr-4 relative">
                  <img
                    src="src/assets/images/p1.jpg"
                    alt="Maria"
                    className="object-fill w-full h-full rounded-lg"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    María González
                  </h4>
                  <div className="flex text-yellow-400">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Increíble calidad y diseño. Cada pieza que he comprado supera
                mis expectativas. Definitivamente mi tienda favorita de moda."
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg fade-up">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-200 rounded-full mr-4 relative">
                  <img
                    src="src/assets/images/p3.jpg"
                    alt="Ana"
                    className="object-fill w-full h-full rounded-lg"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Ana Rodríguez</h4>
                  <div className="flex text-yellow-400">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "El servicio al cliente es excepcional y la entrega siempre es
                rápida. Los precios son justos para la calidad que ofrecen."
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-lg fade-right">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-200 rounded-full mr-4 relative">
                  <img
                    src="src/assets/images/p2.jpg"
                    alt="Mario"
                    className="object-fill w-full h-full rounded-lg"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Mario Martínez
                  </h4>
                  <div className="flex text-yellow-400">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Me encanta la variedad de estilos que tienen. Desde casual
                hasta elegante, siempre encuentro algo perfecto para cualquier
                ocasión."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="section_container bg-pink-50 py-12">
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
      </section> */}

      <footer className="section_container bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">BACOVACH</h3>
              <p className="text-gray-400">
                Su principal destino para moda y accesorios modernos.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Enlaces rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Incio
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Sobre nosotros
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contáctanos</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@bacovash.com</li>
                <li>Phone: (555) 123-4567</li>
                <li>Address: Santa Rosa Valencia Estado Carabobo</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BACOVACH. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
