import {
  IconAperture,
  IconCopy,
  IconKeyboard,
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
  },

  {
    id: uniqueId(),
    title: "Practice",
    icon: IconKeyboard,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "TEACHER",
    role: "teacher"
  },

  {
    id: uniqueId(),
    title: "Classes",
    icon: IconSchool,
    href: "/classes",
    role: "teacher"
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


