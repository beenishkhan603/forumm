import React, { useState } from "react";

type WithSelectedOptionProps = {
  options: string[];
  children: (
    selectedOption: string | undefined,
    setSelectedOption: (selectedOption: string | undefined) => void
  ) => React.ReactNode;
};

export const WithSelectedOption = ({
  options,
  children,
}: WithSelectedOptionProps) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    options[0]
  );

  return children(selectedOption, setSelectedOption);
};
