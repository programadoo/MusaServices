import React, { useContext } from "react";
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

  const createOrder = (data: any, actions: any) => {
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

  const onApprove = (data: any, actions: any) => {
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
        createOrder={(data, actions) => createOrder(data, actions)}
        onApprove={(data, actions) => onApprove(data, actions)}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalButtonComponent;