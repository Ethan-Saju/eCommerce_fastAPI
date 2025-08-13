import React, { use, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  Link,
  Text,
  VStack,
  Center,
} from "@chakra-ui/react";
import { FaShoppingBag } from "react-icons/fa";

import { Toaster, toaster } from "../components/chakra-comps/toaster";

import { Flex } from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

const AuthForm = ({ mode }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url =
      mode === "login"
        ? "http://localhost:8000/users/login"
        : "http://localhost:8000/users/register";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log();
        toaster.create({
          title: "Something went wrong",
          description: data.detail,
          type: "error",
        });
        return;
      }

      if (mode === "login" && data.access_token) {
        localStorage.setItem("token", data.access_token);
        navigate("/store");
      } else {
        setForm({ email: "", password: "" });
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      toaster.create({
        title: "Internal Server Error",
        type: "error",
      });
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <Flex
        height="100vh"
        justifyContent="center"
        alignItems="center"
        bg="#121212"
      >
        <Box
          bg="black"
          p={8}
          borderRadius="md"
          width="350px"
          color="white"
          mx="auto"
          mt={20}
        >
          <Heading mb={2} textAlign="center" color="whiteAlpha.900" size="3xl">
            myStore
          </Heading>
          <Center mb={6}>
            <FaShoppingBag size="3em" color="teal" />
          </Center>
          <Heading mb={6} textAlign="center" color="whiteAlpha.900">
            {mode === "login" ? "Login" : "Register"}
          </Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Input
                placeholder="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                bg="#333"
                color="white"
                _placeholder={{ color: "gray.400" }}
                border="1px solid #555"
              />
              <Input
                placeholder="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                bg="#333"
                color="white"
                _placeholder={{ color: "gray.400" }}
                border="1px solid #555"
              />
              <Button colorScheme="teal" type="submit" width="full">
                {mode === "login" ? "Login" : "Register"}
              </Button>
            </VStack>
          </form>
          <Text mt={4} textAlign="center" color="whiteAlpha.700" fontSize="sm">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <Link
                  href="/register"
                  color="teal.300"
                  textDecoration="underline"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/login" color="teal.300" textDecoration="underline">
                  Login
                </Link>
              </>
            )}
          </Text>
        </Box>
        <Toaster />
      </Flex>
    </>
  );
};

export default AuthForm;
