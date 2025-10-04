import {
  IconAperture,
  IconCopy,
  IconHome,
  IconKeyboard,
  IconCirclePlus,
  IconDoorEnter,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
  IconSchool
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "HOME",  
    icon: IconHome,
  },

  {
    id: uniqueId(),
    title: "Practice",
    icon: IconKeyboard,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "CLASSES",
    role: "teacher"
  },

  {
    id: uniqueId(),
    title: "Create a Class",
    icon: IconCirclePlus,
    href: "/class/create",
    role: "teacher"
  },
  {
    navlabel: true,
    subheader: "CLASSES",
    role: "student"
  },

  {
    id: uniqueId(),
    title: "Join a Class",
    icon: IconDoorEnter,
    href: "/class/join",
    role: "student"
  },
/*  {
    navlabel: true,
    subheader: "UTILITIES",
  },
  {
    id: uniqueId(),
    title: "Typography",
    icon: IconTypography,
    href: "/utilities/typography",
  },
  {
    id: uniqueId(),
    title: "Shadow",
    icon: IconCopy,
    href: "/utilities/shadow",
  },
  {
    navlabel: true,
    subheader: "AUTH",
  },
  {
    id: uniqueId(),
    title: "Login",
    icon: IconLogin,
    href: "/authentication/login",
  },
  {
    id: uniqueId(),
    title: "Register",
    icon: IconUserPlus,
    href: "/authentication/register",
  },
  {
    navlabel: true,
    subheader: " EXTRA",
  },
  {
    id: uniqueId(),
    title: "Icons",
    icon: IconMoodHappy,
    href: "/icons",
  },
  {
    id: uniqueId(),
    title: "Sample Page",
    icon: IconAperture,
    href: "/sample-page",
  },*/

];

export default Menuitems;


