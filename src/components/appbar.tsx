import React from "react";
import {navbarMenu} from "../menus";
import {NavLink} from "react-router-dom";

import {Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";

const BlogAppbar: React.FC = () => {


    return (
        <Navbar isBordered={true}>
            <NavbarBrand>
                <Link className="font-bold text-inherit ml-1" href={'/'}>梁典典的博客</Link>
            </NavbarBrand>
            <NavbarContent className=" sm:flex gap-4" justify="center">
                {navbarMenu.map((page) => (
                    <NavLink key={page.url} color="foreground" to={page.url} className={({isActive}) => {
                        return isActive ? 'text-primary font-bold' : ''
                    }}>
                        <NavbarItem>
                            {page.title}
                        </NavbarItem>
                    </NavLink>
                ))}
            </NavbarContent>
            <NavbarContent justify={'end'}>
                <NavbarItem>
                    <Button
                        href="https://admin.itbug.shop"
                        as={Link}
                        showAnchorIcon
                        variant="solid"
                        target={'_blank'}
                    >
                        登录
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
};

export default BlogAppbar;
