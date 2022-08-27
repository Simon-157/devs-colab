import React from "react";
import Select from "react-select";
import { languageOptions } from "../../utils/editor-constants/languages";
import { customStyles } from "./../../utils/editor-constants/customStyles";

const LanguagesDropdown = ({ onSelectChange }) => {
  return (
    <Select
      placeholder={`Filter By Category`}
      options={languageOptions}
      styles={customStyles}
      defaultValue={languageOptions[0]}
      onChange={(selectedOption) => onSelectChange(selectedOption)}
    />
  );
};

export default LanguagesDropdown;