import { Box, HStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const CollapsibleOrder = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box
      h={"10vh"}
      textAlign={"left"}
      bgColor={"gray.800"}
      alignContent={"center"}
      px={5}
      borderRadius={5}
      fontWeight={"bold"}
      cursor={"pointer"}
      onClick={() => setIsOpen((prevState) => !prevState)}
    >
      <HStack>
        Order #{order.id}
        {isOpen ? <FaAngleUp /> : <FaAngleDown />}
      </HStack>
    </Box>
  );
};

export default CollapsibleOrder;
