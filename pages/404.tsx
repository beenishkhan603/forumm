import Box from "@components/base/Box";
import { Button } from "@components/inputs/Button";
import EmptyLayout from "@layouts/EmptyLayout";
import React from "react";

const NotFoundPage = () => {
  return (
    <Box className="flex flex-col items-center">
      <Box className="text-5xl text-white text-center mt-64 max-w-2xl">
        {"Sorry, we couldn't find what you were looking for! 😢"}
      </Box>
      <Box className="text-xl text-white text-center mt-4 mb-16">
        404 Not Found
      </Box>
      <Button title="Back to main page" type="primary" href="/" />
    </Box>
  );
};

NotFoundPage.Layout = EmptyLayout;

export default NotFoundPage;
