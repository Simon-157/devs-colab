//libraries
import { createContext, useState } from "react";

export const modalContext = createContext();

const ModalContextProvider = ({ children }) => {
    const [open, setOpen] = useState(false)

  return (
    <modalContext.Provider
      value={{ open, setOpen }}
    >
      {children}
    </modalContext.Provider>
  );
};

export default ModalContextProvider;