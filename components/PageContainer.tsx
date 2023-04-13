import { Center, Container, MantineSize, Title } from "@mantine/core";
import { ReactNode } from "react";
import HighlightedTitle from "./HighlightedTitle";

export default function PageContainer({
  children,
  highlightedTitle = null,
  title = null,
  fluid = false,
  size = "md",
}: {
  children: ReactNode;
  highlightedTitle?: string | null;
  title?: string | null;
  fluid?: boolean;
  size?: MantineSize;
}) {
  return (
    <>
      {highlightedTitle && <HighlightedTitle title={highlightedTitle} />}

      <div style={{ paddingTop: highlightedTitle ? 0 : 40, paddingBottom: 40 }}>
        {title && (
          <Container fluid={fluid} size={size}>
            <Center>
              <Title>{title}</Title>
            </Center>
          </Container>
        )}
        {children}
      </div>
    </>
  );
}
