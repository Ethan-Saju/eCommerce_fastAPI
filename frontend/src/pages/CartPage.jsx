import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Image,
  Text,
  Button,
  SimpleGrid,
  Flex,
  IconButton,
  Stack,
  Heading,
} from "@chakra-ui/react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import Navbar from "../components/ui-comps/navbar";
import { Toaster, toaster } from "../components/chakra-comps/toaster";
function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <Card.Root maxW="md" overflow="hidden" mb="6" boxShadow="md">
      <Card.Body>
        <Flex gap={4} alignItems="center">
          <Image
            src="/sample.jpg"
            alt={item.name}
            boxSize="80px"
            objectFit="cover"
            borderRadius="md"
          />
          <Box flex="1">
            <Text fontWeight="bold">{item.name}</Text>
            <Text fontSize="sm" color="gray.500">
              ${item.subtotal.toFixed(2)}
            </Text>

            <Flex alignItems="center" mt={2} gap={3}>
              <IconButton
                size="sm"
                onClick={() => onDecrease(item)}
                bg="transparent"
                color="white"
              >
                <FaMinus />
              </IconButton>
              <Text>{item.quantity}</Text>
              <IconButton
                size="sm"
                onClick={() => onIncrease(item)}
                bg="transparent"
                color="white"
              >
                <FaPlus />
              </IconButton>
            </Flex>
          </Box>

          <IconButton
            size="sm"
            colorScheme="red"
            onClick={() => onRemove(item)}
          >
            <FaTrash />
          </IconButton>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}

function SummaryCard({ total, cart, handleCheckout }) {
  return (
    <Card.Root boxShadow="lg" p={4}>
      <Card.Body>
        <Heading size="md" mb={4}>
          Order Summary
        </Heading>
        <Stack spacing={2}>
          {cart.map((item) => (
            <Flex key={item.id} justify="space-between">
              <Text>
                {item.name} × {item.quantity}
              </Text>
              <Text>Rs {item.subtotal.toFixed(2)}</Text>
            </Flex>
          ))}
        </Stack>
        <Flex justify="space-between" fontWeight="bold" mt={4}>
          <Text>Total:</Text>
          <Text>${total.toFixed(2)}</Text>
        </Flex>
      </Card.Body>
      <Card.Footer>
        <Button w="full" onClick={handleCheckout}>
          Place Order
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchCart = async () => {
    try {
      const response = await fetch("http://localhost:8000/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }
      const data = await response.json();

      const updatedItems = await Promise.all(
        data.items.map(async (item) => {
          const productRes = await fetch(
            `http://localhost:8000/products/${item.product_id}`
          );
          const product = await productRes.json();

          return {
            ...item,
            name: product.name,
            price: product.price,
            subtotal: product.price * item.quantity,
          };
        })
      );

      let totalPrice = 0;
      updatedItems.forEach((item) => {
        totalPrice += item.subtotal;
      });

      setTotal(totalPrice);
      console.log(totalPrice);
      setCart(updatedItems);
      console.log(updatedItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const increaseQuantity = async (item) => {
    const id = item.id;
    const quantity = item.quantity;
    const url = `http://localhost:8000/cart/items/${id}`;

    await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: quantity + 1,
      }),
    });

    fetchCart();
  };

  const decreaseQuantity = async (item) => {
    const id = item.id;
    const quantity = item.quantity;
    const url = `http://localhost:8000/cart/items/${id}`;

    await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: quantity - 1,
      }),
    });

    fetchCart();
  };

  const removeItem = async (item) => {
    const id = item.id;

    const url = `http://localhost:8000/cart/items/${id}`;

    await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    fetchCart();
  };

  const handleCheckout = async () => {
    if (total <= 0) {
      toaster.create({
        title: "Cart is Empty",
        type: "error",
      });
      return;
    }

    const url = `http://localhost:8000/orders/`;

    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    toaster.create({
      title: "Order Placed Successfully",
      type: "success",
    });

    fetchCart();
  };

  return (
    <>
      <Navbar />
      <Box p={20} gap="10">
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={10} w="100%">
          <Box>
            <Heading mb={6}>Your Cart</Heading>
            {cart.length === 0 ? (
              <Text fontSize="lg" color="gray.600">
                Your cart is empty!
                <br />
                Head over to the store and add some items to get started!
              </Text>
            ) : (
              cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrease={increaseQuantity}
                  onDecrease={decreaseQuantity}
                  onRemove={removeItem}
                />
              ))
            )}
          </Box>

          <SummaryCard
            total={total}
            cart={cart}
            handleCheckout={handleCheckout}
          />
        </SimpleGrid>
      </Box>
      <Toaster />
    </>
  );
}
