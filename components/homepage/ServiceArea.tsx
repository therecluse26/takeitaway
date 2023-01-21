import { Box, Container, Grid, Title } from "@mantine/core";
import Image from "next/image";
import { pageMessages } from "../../data/messaging";
import phoenixMap from "../../public/images/Phoenix-Map.jpg";

export default function ServiceArea({ classes }: { classes: any }) {
  return (
    <Container size="lg">
      <Box>
        <Grid gutter={40}>
          <Grid.Col span={12} sm={6}>
            <Title>{pageMessages.serviceArea.title}</Title>
            <div className={classes.lightText}>
              <span
                dangerouslySetInnerHTML={{
                  __html: pageMessages.serviceArea.text,
                }}
              ></span>
            </div>
          </Grid.Col>
          <Grid.Col span={12} sm={6}>
            <Image
              src={phoenixMap}
              alt={"Phoenix Map"}
              className={classes.serviceAreaImage}
            />
          </Grid.Col>
        </Grid>
      </Box>
    </Container>
  );
}
