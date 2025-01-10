"use client";
import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Container, Box } from "@mui/material";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import axios from "axios";
import { UserContext } from "../_Contexts/UserContext";
import { usePathname, useRouter } from "next/navigation";

export default function Singup() {
  const Router = useRouter();
  const { setUserLogin, setMyInfo } = useContext(UserContext);
  const [isLoading, setisLoading] = useState(false);

  function handleSignup(formvalues: any) {
    setisLoading(true);
    return axios
      .post(`https://4ce3-41-36-81-23.ngrok-free.app/signup/`, formvalues)
      .then((respone) => {
        if (respone.data.msg === "user created successfully") {
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
        console.log(error.data);
      });
  }
  let Formk = useFormik({
    initialValues: { username: "", email: "", password: "" },
    onSubmit: handleSignup,
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
          height: "70vh",
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
          <h1 className=" ">Sing up</h1>
          <TextField
            name="username"
            helperText="Please enter your Name"
            id="username"
            label="name"
            type="text"
            fullWidth
            value={Formk.values.username}
            onChange={Formk.handleChange}
            onBlur={Formk.handleBlur}
            sx={{
              "& .MuiFormHelperText-root": {
                color: "whitle",
              },
            }}
          />
          <TextField
            name="email"
            helperText="Please enter your Email"
            id="email"
            label="email"
            type="text"
            fullWidth
            value={Formk.values.email}
            onChange={Formk.handleChange}
            onBlur={Formk.handleBlur}
            sx={{
              "& .MuiFormHelperText-root": {
                color: "whitle",
              },
            }}
          />
          <TextField
            name="password"
            helperText="Please enter your Password"
            id="password"
            label="password"
            type="password"
            autoComplete="password"
            fullWidth
            value={Formk.values.password}
            onChange={Formk.handleChange}
            onBlur={Formk.handleBlur}
            sx={{
              "& .MuiFormHelperText-root": {
                color: "whitle", // تغيير اللون هنا
              },
            }}
          />
          <Button type="submit" variant="contained" color="success">
            {isLoading ? (
              <i className="fa-duotone fa-solid fa-spinner fa-spin"></i>
            ) : (
              `Signup Now`
            )}
          </Button>
        </Box>
      </Container>
    </form>
  );
}
