import { Box, Container, Grid, Title } from "@mantine/core";
import Image from "next/image";
import phoenixMap from "../../public/images/Phoenix-Map.jpg";

export default function ServiceArea({ classes }: { classes: any }) {
  return (
    <Container size="lg">
      <Box>
        <Grid gutter={40}>
          <Grid.Col span={12} sm={6}>
            <Title>Service Area - Phoenix Metro, Arizona</Title>
            <div className={classes.lightText}>
              <p>
                We service the Phoenix/Maricopa County areas but are hoping to
                have the opportunity to expand to other communities soon!
              </p>
              <p>
                <b>SUMMER HOURS:</b>
              </p>
              <ul>
                <li>Mon: 8AM - 5PM</li>
                <li>Wed: 8AM - 5PM</li>
                <li>Fri: 8AM - 5PM</li>
                <li>Sat: 8AM - 5PM</li>
              </ul>
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
