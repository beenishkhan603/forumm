import VerifyCodeForm from "@components/authforms/VerifyCodeForm";
import Box from "@components/base/Box";
import EmptyLayout from "@layouts/EmptyLayout";
import React from "react";

export default function VerifyAccount() {
  return (
    <Box className="flex justify-center">
      <VerifyCodeForm />
    </Box>
  );
}

VerifyAccount.Layout = EmptyLayout;
