import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  Image,
  Stack,
  Badge,
  SimpleGrid,
  Button,
  CardFooter,
  Input,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useLocation, replace } from "react-router-dom";

import Navbar from "../components/ui-comps/navbar";
import { Toaster, toaster } from "../components/chakra-comps/toaster";

function SearchBar({ keyword, setKeyword, searchProducts }) {
  return (
    <HStack p="20" pb="0">
      <Input
        placeholder="Search for products"
        size="lg"
        w="50%"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            searchProducts();
          }
        }}
      />
      <Button onClick={searchProducts}>
        <Icon>
          <FaSearch />
        </Icon>
      </Button>
    </HStack>
  );
}

function ProductCard({ id, name, description, price, imageUrl }) {
  const navigate = useNavigate();
  return (
    <Card.Root maxW="sm" overflow="hidden" mb="6" boxShadow="md">
      <Card.Body gap="2">
        <Image src="./sample.jpg" alt={name} borderRadius="md" />
        <Card.Title>{name}</Card.Title>
        <Text textStyle="2xl" fontWeight="medium" letterSpacing="tight" mt="2">
          Rs {price.toFixed(2)}
        </Text>
      </Card.Body>
      <Card.Footer gap="2">
        <Button variant="solid" onClick={() => navigate(`/product/${id}`)}>
          Check it out
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}

function Pagination({ total, pageSize, currentPage, setCurrentPage }) {
  const totalPages = Math.ceil(total / pageSize);
  return (
    <HStack w="100%" justify="center" spacing={4} mb="20">
      <Button
        variant="ghost"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
      >
        {"<"}
      </Button>

      <Button variant="outline">{currentPage}</Button>

      <Button
        variant="ghost"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
      >
        {">"}
      </Button>
    </HStack>
  );
}

export default function Store() {
  const [products, setProducts] = React.useState([]);
  const [keyword, setKeyword] = useState("");

  const location = useLocation();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("http://localhost:8000/products");
        if (!response.ok) {
          throw new Error("Error");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }

    fetchProducts();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.showToast) {
      toaster.create({
        title: "Product added to cart",
        type: "success",
      });
    }

    navigate(location.pathname, { replace: true, state: {} });
  }, []);

  const searchProducts = async () => {
    console.log("Searching for:", keyword);

    try {
      const response = await fetch(
        `http://localhost:8000/products/search/?keyword=${encodeURIComponent(
          keyword
        )}`
      );

      if (!response.ok) {
        throw new Error("Error");
      }
      const data = await response.json();
      setProducts(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const currentProducts = products.slice(startIndex, endIndex);

  return (
    <>
      <Navbar />
      <SearchBar
        keyword={keyword}
        setKeyword={setKeyword}
        searchProducts={searchProducts}
      />
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 4 }}
        spacing={6}
        p={20}
        gap={10}
      >
        {currentProducts.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </SimpleGrid>
      <Pagination
        total={products.length}
        pageSize={pageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <Toaster />
    </>
  );
}
