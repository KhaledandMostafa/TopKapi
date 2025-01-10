"use client";
import { createContext, useContext, useEffect, useState } from "react";

export let UserContext = createContext<any | null>(undefined);

export function UserContextProvider({ children }: any) {
  const [UserLogin, setUserLogin] = useState<any>("Empty");
  const [MyInfo, setMyInfo] = useState<any>([]);
  const [UserID, setUserID] = useState<any>("0");

  useEffect(() => {
    if (localStorage.getItem(`UserLogin`)) {
      setUserLogin(localStorage.getItem(`UserLogin`));
      setUserID([localStorage.getItem("UserData")]);
    } else {
      localStorage.setItem(`UserLogin`, "Empty");
      localStorage.setItem(`UserData`, "Empty");
      localStorage.setItem(`UserID`, "0");
    }
  }, []);

  return (
    <UserContext.Provider
      value={{ UserLogin, setUserLogin, MyInfo, setMyInfo }}
    >
      {children}
    </UserContext.Provider>
  );
}
