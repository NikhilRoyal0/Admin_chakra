import React from "react";
import Sidebar from "./Sidebar/Sidebar";
import Footer from "./Footer/Footer";
import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";

const FullLayout = () => {
  return (
    <Box>
      <Sidebar />
      <Box flex="1" ml={{ base: 0, md: 72 }} p="0">
        <Box minHeight="calc(100vh - 100px)">
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default FullLayout;
