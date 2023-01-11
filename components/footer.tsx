import { Container, createStyles, Footer, Group } from "@mantine/core";
import Link from "next/link";
import { JSXElementConstructor, ReactElement } from "react";

const useStyles = createStyles((theme) => ({
  footer: {
    position: "static",
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.gray[0]
        : theme.colors.gray[9],
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[9]
        : theme.colors.gray[0],
    fontSize: "0.8rem",
  },
  link: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[9]
        : theme.colors.gray[0],
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  container: {
    marginTop: "30px",
  },
}));

export default function FooterBar(): ReactElement<
  any,
  string | JSXElementConstructor<any>
> {
  const { classes } = useStyles();

  return (
    <Footer fixed={false} height={"80px"} className={classes.footer}>
      <Container className={classes.container}>
        <Group position="apart">
          <div>© Take It Away LLC. All rights reserved.</div>
          <div></div>
          <Group>
            <Link href="/privacy-policy" className={classes.link}>
              Privacy Policy
            </Link>
            <Link href="/refunds-policy" className={classes.link}>
              Refund and Returns Policy
            </Link>
          </Group>
        </Group>
      </Container>
    </Footer>
  );
}
