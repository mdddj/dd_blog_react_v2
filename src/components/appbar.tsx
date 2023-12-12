import React from "react";
import {navbarMenu} from "../menus";
import {NavLink, useNavigate} from "react-router-dom";
import {useMount} from "react-use";
import {blogApi, getAccessToken} from "../utils/request";
import {ApiResponse, User} from "../models/app_model";
import {useRecoilState} from "recoil";
import {userProvider} from "../providers/user";

import logo from "../assets/avatar.jpeg"
import {Avatar, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";

const BlogAppbar: React.FC = () => {
    const [user, setUser] = useRecoilState(userProvider);

    const nav = useNavigate()

    //启动的时候尝试自动登录
    useMount(async () => {
        let token = getAccessToken();
        if (token !== "") {
            let response = await blogApi().requestT<ApiResponse<User>>(
                "/api/get-user-by-token",
                {token: token},
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
        <Navbar>
            <NavbarBrand>
                <Avatar src={logo}/>
                <Link className="font-bold text-inherit ml-1" href={'/'}>梁典典的博客</Link>
            </NavbarBrand>
            <NavbarContent className=" sm:flex gap-4" justify="center">
                {navbarMenu.map((page) => (
                    <NavbarItem key={page.url} >
                        <Link color="foreground" href={page.url}>
                            {page.title}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>
        </Navbar>
    );
};

export default BlogAppbar;
