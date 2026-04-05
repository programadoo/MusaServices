import { useContext } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
// Importamos el contexto para acceder al total real del carrito
import { EcommerceContext } from "../../context/EcommerceContext";

const PaypalButtonComponent = () => {
  // Extraemos el total y la función para limpiar el carrito del contexto
  const context = useContext(EcommerceContext);

  // Si por alguna razón el contexto no carga, no mostramos el botón
  if (!context) return null;
  const { total, clearCart } = context;

  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  // Línea 20: Cambiamos data por _data
  const createOrder = (_data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          description: "Compra en VillaTech", // Descripción para el recibo de PayPal
          amount: {
            currency_code: "USD",
            // IMPORTANTE: Ahora usamos el total global del carrito
            value: total.toFixed(2).toString(), 
          },
        },
      ],
    });
  };

  // Línea 35: Cambiamos data por _data
  const onApprove = (_data: any, actions: any) => {
    return actions.order.capture().then(function (details: any) {
      alert("Transacción completada por: " + details.payer.name.given_name);
      // Limpiamos el carrito después de un pago exitoso
      clearCart();
    });
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{
          layout: "horizontal",
          color: "blue",
          shape: "rect",
          label: "pay",
        }}
        // Para evitar errores si el total es 0, deshabilitamos el botón si no hay nada
        disabled={total <= 0}
        // Actualizamos también las llamadas aquí para que coincidan
        createOrder={(_data, actions) => createOrder(_data, actions)}
        onApprove={(_data, actions) => onApprove(_data, actions)}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalButtonComponent;