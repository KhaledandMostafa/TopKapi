"use client";
import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Container, Box } from "@mui/material";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import axios from "axios";
import { UserContext } from "../_Contexts/UserContext";
import { usePathname, useRouter } from "next/navigation";

export default function Login() {
  const Router = useRouter();
  const { UserLogin, setUserLogin, MyInfo, setMyInfo } =
    useContext(UserContext);
  const [isLoading, setisLoading] = useState(false);
  const [Errors, setErrors] = useState<any>([]);
  function handleLogin(formvalues: any) {
    setisLoading(true);
    return axios
      .post(`https://4ce3-41-36-81-23.ngrok-free.app/signin/`, formvalues)
      .then((respone) => {
        if (respone.data.msg === "Login successful") {
          localStorage.setItem("UserLogin", respone.data.token);
          localStorage.setItem("UserData", respone.data.userdata);
          localStorage.setItem("UserID", respone.data.userId);
          setMyInfo(respone.data.userdata);
          setUserLogin(respone.data.token);
          Router.push("/");
        }
        console.log(respone.data);
      })
      .catch((error) => {
        setisLoading(false);
        setErrors(error.response.data.msg);
      });
  }
  let Formk = useFormik({
    initialValues: { email: "", password: "" },
    onSubmit: handleLogin,
  });

  useEffect(() => {
    if (localStorage.getItem(`UserLogin`) != "Empty") {
      Router.replace("/");
    }
    return () => {};
  }, []);

  return (
    <form onSubmit={Formk.handleSubmit}>
      <Container
        maxWidth="xs"
        sx={{
          height: "50vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <h1 className=" ">Login</h1>
          <h4 className="ErrorMsgLogin">{Errors}</h4>

          <TextField
            id="email"
            name="email"
            value={Formk.values.email}
            helperText="Please enter your Email"
            label="Email"
            type="email"
            fullWidth
            onChange={Formk.handleChange}
            onBlur={Formk.handleBlur}
          />
          <TextField
            id="password"
            name="password"
            value={Formk.values.password}
            helperText="Please enter your Password"
            label="Password"
            type="password"
            autoComplete="password"
            fullWidth
            onChange={Formk.handleChange}
            onBlur={Formk.handleBlur}
          />
          <Button type="submit" variant="contained" color="success">
            {isLoading ? (
              <i className="fa-duotone fa-solid fa-spinner fa-spin"></i>
            ) : (
              `Sign in`
            )}
          </Button>
        </Box>
      </Container>
    </form>
  );
}
