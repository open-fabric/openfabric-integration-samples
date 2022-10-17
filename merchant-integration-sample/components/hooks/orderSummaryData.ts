import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import {
  payment_gateway_name,
  payment_gateway_publish_key,
} from "../../lib/variables";
export const OrderSummaryDataHook = (props?: any) => {
  const flow = props.flow;
  const customer_info = {
    mobile_number: faker.phone.phoneNumber("!##-!##-####"),
    first_name: faker.name.firstName(),
    email: faker.internet.email(),
  };
  const item = {
    item_id: "P100-1222",
    name: "iPhone",
    variation_name: "Alpine Green, 128GB",
    description: "iPhone 13 Pro,6.1-inch display",
    categories: ["phone"],
    quantity: 1,
    original_price: 999,
    tax_code: "VAT",
    tax_amount_percent: 3,
    price: 1028.97,
    discount_amount: 0,
    amount: 1028.97,
  };

  const address_line_1 = faker.address.streetAddress();
  const post_code = faker.address.zipCode("###");
  const shipping_address = {
    country_code: "sg",
    address_line_1,
    post_code,
    self_pickup: true,
  };

  const billing_address = {
    country_code: "sg",
    address_line_1,
    post_code,
  };
  const shipping_amount = 0;
  const [partner_reference_id] = useState(`MT${Date.now()}`);
  const [order, setOrder] = useState({
    customer_info,
    amount: item.amount + shipping_amount,
    currency: "SGD",
    partner_reference_id,
    transaction_details: {
      shipping_address,
      billing_address,
      items: [item],
      tax_amount_percent: 0,
      shipping_amount: shipping_amount,
      original_amount: item.amount,
    },
    ...(flow === "pg" && {
      pg_name: payment_gateway_name,
      pg_publishable_key: payment_gateway_publish_key,
    }),
  });
  const [amount, setAmount] = useState(order.amount);
  const [currency, setCurrency] = useState(order.currency);

  useEffect(() => {
    const updatedOrder = { ...order };
    const rawAmount = order.transaction_details.items[0].price;
    updatedOrder.amount = amount;
    updatedOrder.transaction_details.items[0].discount_amount =
      rawAmount - amount;
    updatedOrder.transaction_details.items[0].amount = amount;
    updatedOrder.transaction_details.original_amount = amount;
    setOrder(updatedOrder);
  }, [amount]);

  useEffect(() => {
    const updatedOrder = { ...order };
    updatedOrder.currency = currency;
    setOrder(updatedOrder);
  }, [currency]);

  const onAmountChange = (e: { target: { value: string } }) => {
    const newAmount = parseFloat(e.target.value);
    setAmount(isNaN(newAmount) ? 0 : newAmount);
  };
  const onCurrencyChange = (e: { target: { value: any } }) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
  };

  const onOrderChange = (input: { propName: string; value: any }) => {
    if (input.propName === "amount") {
      onAmountChange({ target: { value: `${input.value}` } });
      return
    }
    if(input.propName === 'currency') {
      onCurrencyChange({ target: { value: `${input.value}` } });
      return
    }
    if(input.propName === 'pg_publishable_key') {

      if(!input.value) {
        const updatedOrder = { ...order, [input.propName]: input.value };
        delete updatedOrder['pg_publishable_key']
        setOrder(updatedOrder)
        return
      }
    }
    if(Object.keys(order).includes(input.propName)) {
      const updatedOrder = { ...order, [input.propName]: input.value };
      setOrder(updatedOrder)
    }
    return
  };
  return {
    amount,
    currency,
    order,
    onAmountChange,
    onCurrencyChange,
    partner_reference_id,
    onOrderChange
  };
};
