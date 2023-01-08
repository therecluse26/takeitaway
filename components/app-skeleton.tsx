import { AppShell, Container } from "@mantine/core";
import { defaultNavBarLinks } from "../data/navbar-links";
import Navbar from "./navbar";

export default function AppSkeleton() {
  return (
    <AppShell navbar={<Navbar links={defaultNavBarLinks} mounted={false} />}>
      <Container fluid={true} />
    </AppShell>
  );
}
