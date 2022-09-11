//libraries
import { useQuery } from "react-query";
import { createContext } from "react";

//components
import getUser from './helper'

export const userContext = createContext();

const UserProvider = ({ children }) => {

  const { data:currentUser, isCurrentUserLoading } = useQuery("current-user", getUser);

  return (
    <userContext.Provider
      value={{ currentUser, getUser, isCurrentUserLoading }}
    >
      {children}
    </userContext.Provider>
  );
};

export default UserProvider;