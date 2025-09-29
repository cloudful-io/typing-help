import Link from "next/link";
import { styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  height: "70px",
  width: "180px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled href="/">
      <Image src="/images/logos/logo512.png" alt="logo" height={72} width={72} style={{ display: "block", margin: "0 auto" }} priority />
    </LinkStyled>
  );
};

export default Logo;
  