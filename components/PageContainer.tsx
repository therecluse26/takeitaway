import { Center, Container, Title } from "@mantine/core";
import { ReactNode } from "react";
import HighlightedTitle from "./HighlightedTitle";

export default function PageContainer({
  children,
  highlightedTitle = null,
  title = null,
}: {
  children: ReactNode;
  highlightedTitle?: string | null;
  title?: string | null;
}) {
  return (
    <>
      {highlightedTitle && <HighlightedTitle title={highlightedTitle} />}

      <div style={{ paddingTop: highlightedTitle ? 0 : 40, paddingBottom: 40 }}>
        {title && (
          <Container>
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
