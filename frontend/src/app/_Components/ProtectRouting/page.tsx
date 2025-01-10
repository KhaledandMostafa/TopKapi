"use client";
import { UserContext } from "@/app/_Contexts/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function ProtectRouting({ children }: any) {
  const { UserLogin, MyInfo } = useContext(UserContext);
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("UserLogin") === "Empty") {
      if (
        path !== "/" &&
        path !== "/Login" &&
        path !== "/Signup" &&
        path !== "/Contact"
      ) {
        console.log("GO to Login");
        router.replace("/Login");
      }
    } else {

    }
  }, [router, path]);

  return <>{children}</>;
}
