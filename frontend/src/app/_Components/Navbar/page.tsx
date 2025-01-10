"use client";
import { useContext, useEffect } from "react";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { UserContext } from "@/app/_Contexts/UserContext";
import logo from "../../../images/logo.jpg";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CartContext } from "@/app/_Contexts/CartContext";

const pages = ["Home", "Cart", "Contact"];
const settings = ["Logout"];

function Navbar() {
  let { UserLogin, setUserLogin, MyInfo } = useContext(UserContext);
  let { Cart, GetCart }: any = useContext(CartContext);
  const Router = useRouter();
  const path = usePathname();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function LogOut() {
    setUserLogin("Empty");
    localStorage.setItem(`UserLogin`, "Empty");
    localStorage.setItem(`UserData`, "Empty");
    localStorage.setItem(`UserID`, "0");
    Router.replace("/Login");
  }

  useEffect(() => {
    GetCart();
    return () => {};
  }, []);

  return (
    <AppBar position="static" sx={{ backgroundColor: "black" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href={`/`}>
            <img className="logo" src="/images/logo.jpg" alt="Logo" />
          </Link>

          <Box sx={{ flexGrow: 5, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Link href={page == "Home" ? "/" : `/${page}`}>
                    <Typography sx={{ textAlign: "center" }}>{page}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {localStorage.getItem(`UserLogin`) === `Empty` ? (
              <>
                <Link key={1} href={"/"}>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block", mx: 5 }}
                  >
                    HOME
                  </Button>
                </Link>
                <Link key={2} href={"/Contact"}>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    Contact
                  </Button>
                </Link>
              </>
            ) : (
              pages.map((page, index) => (
                <Link key={page} href={page === "Home" ? "/" : `/${page}`}>
                  <Button
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, display: "block", color: "white" }}
                  >
                    {page}
                  </Button>
                </Link>
              ))
            )}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {localStorage.getItem(`UserLogin`) === "Empty" ? (
              <>
                <Link href="/Login">
                  <Button color="inherit">Login</Button>
                </Link>
                <Link href="/Signup">
                  <Button color="inherit">Signup</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href={`/Cart`}>
                  <i
                    style={{
                      marginRight: "35px",
                      marginLeft: "10px",
                      fontSize: "20px",
                      verticalAlign: "middle",
                    }}
                  >
                    {Cart.length}
                    <i
                      style={{
                        marginLeft: "10px",
                        fontSize: "28px",
                        verticalAlign: "middle",
                      }}
                      className="fa-solid fa-cart-shopping"
                    ></i>
                  </i>
                </Link>

                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar src="/broken-image.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => {
                        handleCloseUserMenu;
                        LogOut();
                      }}
                    >
                      <Typography sx={{ textAlign: "center" }}>
                        {setting}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
