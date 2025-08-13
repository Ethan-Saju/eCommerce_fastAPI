import React from "react";
import { Box, Flex, Link, Spacer, HStack, Button } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";
import { IoBagHandleOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { IoReceipt } from "react-icons/io5";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box bg="#121212" px={6} py={4} boxShadow="md">
      <Flex
        maxW="1200px"
        mx="auto"
        alignItems="center"
        direction={{ base: "column", md: "row" }}
      >
        <Box color="white" fontWeight="bold" fontSize="2xl">
          myStore
        </Box>
        <Spacer />
        <HStack spacing={6}>
          <Button onClick={() => navigate("/store")} variant={"ghost"}>
            Store
            <IoBagHandleOutline />
          </Button>
          <Button onClick={() => navigate("/cart")} variant={"ghost"}>
            Cart
            <CiShoppingCart />
          </Button>
          <Button onClick={() => navigate("/orders")} variant={"ghost"}>
            Order
            <IoReceipt />
          </Button>
          <Button onClick={handleLogout} variant={"ghost"}>
            Logout
            <IoIosLogOut />
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
}
