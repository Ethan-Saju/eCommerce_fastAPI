import { Box, Card, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";

function OrderItemCard({ item }) {
  return (
    <Card.Root boxShadow="sm" mb={4} overflow="hidden">
      <Card.Body>
        <Flex align="center" gap={4}>
          <Image
            src="./sample.jpg"
            alt={item.name}
            boxSize="70px"
            objectFit="cover"
            borderRadius="md"
          />
          <Box flex="1">
            <Text fontWeight="bold">{item.name}</Text>
            <Text fontSize="sm" color="gray.500">
              ${item.price.toFixed(2)} × {item.quantity}
            </Text>
          </Box>
          <Text fontWeight="medium">
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}

export default OrderItemCard;
