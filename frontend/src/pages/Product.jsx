import { Flex, HStack, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Card, Image, Text, Button } from "@chakra-ui/react";
import Navbar from "../components/ui-comps/navbar";
import { useNavigate, useParams } from "react-router-dom";

const defaultProduct = {
  id: 0,
  name: "Sample Product",
  description: "This is a default product shown before the real product loads.",
  price: 9.99,
  imageUrl: "https://picsum.photos/100/100",
};

export default function Product() {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(defaultProduct);
  const { productId } = useParams();

  const url = `http://localhost:8000/products/${productId}`;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const productData = await response.json();
        setProduct(productData);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchProduct();
  }, [url]);

  const addToCart = () => {
    const url = "http://localhost:8000/cart/items";

    try {
      const response = fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: quantity,
        }),
      });

      navigate("/store", { state: { showToast: true } });
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  return (
    <>
      <Navbar />

      <HStack w="100%" justifyContent="center" p={20}>
        <Card.Root maxW="sm" overflow="hidden" mb="6" boxShadow="md" w="75%">
          <Card.Body gap="2">
            <Image src="/sample.jpg" alt={product.name} borderRadius="md" />
            <Card.Title>{product.name}</Card.Title>

            <Text>{product.description}</Text>
            <Text
              textStyle="2xl"
              fontWeight="medium"
              letterSpacing="tight"
              mt="2"
            >
              Rs {product.price.toFixed(2)}
            </Text>

            <HStack spacing={4} justifyContent="center" p={10}>
              <Button
                size="xs"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                bg="transparent"
              >
                <Text color="white" textStyle="2xl">
                  -
                </Text>
              </Button>

              <Text textStyle="2xl"> {quantity}</Text>

              <Button
                size="xs"
                onClick={() => setQuantity((q) => Math.min(q + 1))}
                bg="transparent"
              >
                <Text color="white" textStyle="2xl">
                  +
                </Text>
              </Button>
            </HStack>
          </Card.Body>

          <Card.Footer gap="2">
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={4}
              justify="space-between"
              width="100%"
            >
              <Button
                onClick={addToCart}
                variant="outline"
                colorPalette="green"
              >
                Add to Cart
              </Button>

              <Button
                onClick={() => navigate("/store")}
                variant="outline"
                colorPalette="red"
              >
                Return to Store
              </Button>
            </Stack>
          </Card.Footer>
        </Card.Root>
      </HStack>
    </>
  );
}
