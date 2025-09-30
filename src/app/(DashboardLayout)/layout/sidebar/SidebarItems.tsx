import React from "react";
import Menuitems from "./MenuItems";
import { Box, Stack, Link, Typography } from "@mui/material";
import {
  Logo,
  Sidebar as MUI_Sidebar,
  Menu,
  MenuItem,
  Submenu,
} from "react-mui-sidebar";
import { IconPoint } from '@tabler/icons-react';
//import Link from "next/link";
import { usePathname } from "next/navigation";
import { Upgrade } from "./Updrade";
import { useUserRoles } from "@/contexts/UserRolesContext";

const renderMenuItems = (items: any, pathDirect: any, roles: any) => {

  return items.map((item: any) => {

    const Icon = item.icon ? item.icon : IconPoint;

    const itemIcon = <Icon stroke={1.5} size="1.3rem" />;

    if (item.subheader) {
      // Display Subheader
      if (item.role && !roles.includes(item.role)) {
         return null;
      }
      return (
        <Menu
          subHeading={item.subheader}
          key={item.subheader}
        />
      );
    }

    //If the item has children (submenu)
    if (item.children) {
      return (
        <Submenu
          key={item.id}
          title={item.title}
          icon={itemIcon}
          borderRadius='7px'
        >
          {renderMenuItems(item.children, pathDirect, roles)}
        </Submenu>
      );
    }

    // If the item has no children, render a MenuItem
    if (item.role && !roles.includes(item.role)) return null;

    return (
      <Box px={3} key={item.id}>
        <MenuItem
          key={item.id}
          isSelected={pathDirect === item?.href}
          borderRadius='8px'
          icon={itemIcon}
          link={item.href}
          component={Link}
        >
          {item.title}
        </MenuItem >
      </Box>

    );
  });
};


const SidebarItems = () => {
  const pathname = usePathname();
  const pathDirect = pathname;

  const { roles } = useUserRoles();

  return (
    < >
      <MUI_Sidebar width={"100%"} showProfile={false} themeColor={"#5D87FF"} themeSecondaryColor={'#49beff'} >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Logo img='/images/logos/logo.png' component={Link} to="/" >Typing Help</Logo>
            <Link
              href="/"
              underline="none"
              color="inherit"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Typography variant="h5" noWrap>Typing.Help</Typography>
            </Link>
          </Stack>
        {renderMenuItems(Menuitems, pathDirect, roles)}
        <Box px={2}>
          <Upgrade />
        </Box>
      </MUI_Sidebar>

    </>
  );
};
export default SidebarItems;
