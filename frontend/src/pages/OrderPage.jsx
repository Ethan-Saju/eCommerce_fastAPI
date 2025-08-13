import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Text,
  Flex,
  Stack,
  Badge,
  Heading,
  Button,
  Collapsible,
} from "@chakra-ui/react";
import OrderItemCard from "../components/ui-comps/OrderItemCard";
import CollapsibleOrder from "../components/ui-comps/CollapsibleOrder";
import Navbar from "../components/ui-comps/navbar";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    const url = "http://localhost:8000/orders";

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const orderList = await response.json();

      console.log(orderList);

      const updatedOrders = await Promise.all(
        orderList.map(async (order) => {
          let total = 0;

          const updatedItems = await Promise.all(
            order.items.map(async (item) => {
              const productRes = await fetch(
                `http://localhost:8000/products/${item.product_id}`
              );
              const product = await productRes.json();

              const subtotal = product.price * item.quantity;
              total += subtotal;

              return {
                ...item,
                name: product.name,
                price: product.price,
                subtotal: subtotal,
              };
            })
          );

          return {
            ...order,
            items: updatedItems,
            total: total,
          };
        })
      );
      setOrders(updatedOrders);
      console.log(orders);
    } catch (e) {
      alert("error");
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <>
      <Navbar />
      <Box p={20}>
        <Heading mb={6}>Your Orders</Heading>
        <Stack spacing={8}>
          {orders.map((order) => (
            <Collapsible.Root w={"100%"}>
              <Collapsible.Trigger w={"100%"}>
                <CollapsibleOrder order={order} />
              </Collapsible.Trigger>
              <Collapsible.Content>
                <Card.Root
                  key={order.id}
                  boxShadow="lg"
                  overflow="hidden"
                  borderTopRadius={0}
                >
                  <Card.Body>
                    <Text fontSize="sm" color="white" mb="5">
                      {order.created_at}
                    </Text>

                    <Stack spacing={2}>
                      {order.items.map((item) => (
                        <OrderItemCard key={item.id} item={item} />
                      ))}
                    </Stack>

                    <Flex justify="space-between" fontWeight="bold" mb={4}>
                      <Text>Total:</Text>
                      <Text>${order.total.toFixed(2)}</Text>
                    </Flex>
                  </Card.Body>
                </Card.Root>
              </Collapsible.Content>
            </Collapsible.Root>
          ))}
        </Stack>
      </Box>
    </>
  );
}
