import React from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const PaypalButtonComponent = () => {
  const productSelected = localStorage.getItem("productSelected");
  const product = productSelected !== null ? JSON.parse(productSelected) : null;
  const initialOptions = {
    clientId:
      "AYUKXuOaMrhTBV7nHxKahuFnRK8atwWKCA14svggdsw-_ePftKYO2_3L1ehI4WWYenl7yKAYWm1kTkjY",
    currency: "USD",
    intent: "capture",
  };
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: product?.price.toString(),
          },
        },
      ],
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onApprove = (data: any, actions: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return actions.order.capture().then(function (details: any) {
      alert("Trnasacción completada por: " + details.payer.name.given_name);
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
        createOrder={(data, actions) => createOrder(data, actions)}
        onApprove={(data, actions) => onApprove(data, actions)}
      ></PayPalButtons>
    </PayPalScriptProvider>
  );
};

export default PaypalButtonComponent;
