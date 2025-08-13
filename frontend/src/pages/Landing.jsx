import {
  Flex,
  Heading,
  Highlight,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { FaLocationArrow } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  return (
    <Flex align="center" justify="center" h="100vh" p={20}>
      <Stack align="center">
        <Heading size="5xl" mb="5">
          Welcome to myStore
        </Heading>

        <Text fontSize="md" color="fg.muted" textStyle="3xl" mb="10">
          Your one-stop shop for great deals on amazing products.
        </Text>
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            navigate("/register");
          }}
        >
          <FaLocationArrow />
          Check it out now
        </Button>
      </Stack>
    </Flex>
  );
}

export default LandingPage;
