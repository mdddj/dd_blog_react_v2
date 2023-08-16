import React from "react";
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { navbarMenu } from "../menus";
import { NavLink, useNavigate } from "react-router-dom";
import { useMount } from "react-use";
import { blogApi, getAccessToken, removeAccessToken } from "../utils/request";
import { ApiResponse, User } from "../models/app_model";
import { useRecoilState } from "recoil";
import { userProvider } from "../providers/user";

import logo from "../assets/avatar.jpeg"
import { AccountCircle } from "@mui/icons-material";

const BlogAppbar: React.FC = () => {
  const navigateFunction = useNavigate();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [user, setUser] = useRecoilState(userProvider);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (user) {
      setAnchorElUser(event.currentTarget);
    } else {
      navigateFunction("/login");
    }
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  //启动的时候尝试自动登录
  useMount(async () => {
    let token = getAccessToken();
    if (token !== "") {
      let response = await blogApi().requestT<ApiResponse<User>>(
        "/api/get-user-by-token",
        { token: token },
        "GET"
      );
      if (response.success) {
        setUser(response.data);
      } else {
        //todo 登录信息已失效
      }
    }
  });

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
            <Avatar src={logo} sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            梁典典的博客
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
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
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {navbarMenu.map((page) => (
                <NavLink to={page.url} key={page.title} onClick={()=>{
                    handleCloseNavMenu()
                }}>
                  <MenuItem>
                    <Typography textAlign="center">{page.title}</Typography>
                  </MenuItem>
                </NavLink>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            梁典典的博客
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {navbarMenu.map((page) => (
              <Button
                key={page.url}
                onClick={() => {
                  handleCloseNavMenu();
                  navigateFunction(page.url);
                }}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="打开设置">
              <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="primary-search-account-menu"
                  aria-haspopup="true"
                  color="inherit"
                  onClick={handleOpenUserMenu}>
                  {
                      user && <Avatar alt={user?.nickName} src={user?.picture} />
                  }
                  {
                      !user && <AccountCircle />
                  }
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
              <MenuItem
                onClick={() => {
                  handleCloseUserMenu();
                  navigateFunction("/add-post");
                }}
              >
                发布博客
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleCloseUserMenu();
                  removeAccessToken();
                  setUser(undefined);
                  navigateFunction("/");
                }}
              >
                退出登录
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default BlogAppbar;
