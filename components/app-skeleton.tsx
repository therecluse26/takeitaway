import { AppShell, Container } from "@mantine/core";
import { defaultNavBarLinks } from "../data/navbar-links";
import FooterBar from "./footer";
import Navbar from "./navbar";

export default function AppSkeleton() {
  return (
    <AppShell
      navbar={<Navbar links={defaultNavBarLinks} mounted={true} />}
      footer={<FooterBar />}
    >
      <Container fluid={true} />
    </AppShell>
  );
}
