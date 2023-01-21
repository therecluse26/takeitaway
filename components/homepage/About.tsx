import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Grid,
  Group,
  Title,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

import trashImage1 from "../../public/images/trash-1-410x410.jpg";
import trashImage2 from "../../public/images/trash-2-410x410.jpg";
import trashImage3 from "../../public/images/trash-3-410x410.jpg";

export default function About({
  height,
  classes,
}: {
  height: number | string;
  classes: any;
}) {
  return (
    <Container size="lg">
      <Box style={{ minHeight: height }}>
        <Center style={{ marginTop: "2rem" }}>
          <Title order={2} className={classes.headerAbout}>
            Short-Term Rental and Residential On Demand Trash Services
          </Title>
        </Center>
        <Container size="md" mb="lg">
          <Divider color={"gray"} mt="0" mb="0" />
        </Container>

        <Grid gutter={40} style={{ marginTop: 40 }}>
          <Grid.Col span={12} md={6}>
            <p className={classes.lightText}>
              We are a residential and short-term rental on demand trash
              services-based business. We have subscription services available
              for customers that may own one, or multiple rental properties that
              are rented out on a short-term basis (i.e. Airbnb, Vrbo, etc.) and
              need on demand trash services where the trash is picked up after
              your rental is complete, or, if you are a residential customer
              that just forgot to take the trash out on your scheduled city day
              and need someone to just “Take It Away”, then we are the company
              for you!
            </p>
            <Button component={Link} href="/process" variant="light">
              Learn More
            </Button>
          </Grid.Col>
          <Grid.Col span={12} md={6}>
            <Center style={{ minHeight: 200 }}>
              <Group>
                <Image
                  src={trashImage1}
                  alt="Trash pickup"
                  height={160}
                  width={160}
                />
                <Image
                  src={trashImage2}
                  alt="Dumpsters"
                  height={160}
                  width={160}
                />
                <Image
                  src={trashImage3}
                  alt="Trash cans"
                  height={160}
                  width={160}
                />
              </Group>
            </Center>
          </Grid.Col>
        </Grid>
      </Box>
    </Container>
  );
}
