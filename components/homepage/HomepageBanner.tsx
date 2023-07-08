import { Container, createStyles, Grid, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React, { FC, useEffect, useState } from "react";
import BackgroundImage from "../BackgroundImage";

const useStyles = createStyles((theme) => ({
  headerContainer: {
    paddingTop: "40px",
    paddingBottom: "40px",
  },
  headerSubText: {
    color: theme.colors.gray[0],
    fontWeight: 400,
    fontSize: "28px",
    fontFamily: theme.fontFamily,
    [theme.fn.smallerThan("md")]: {
      fontSize: "22px",
    },
  },
  dotMatrix: {
    background: "url(/images/dotmatrix.png)",
    backgroundSize: "4px",
    mixBlendMode: "hard-light",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    height: "100%",
    width: "100%",
    position: "relative",
    paddingTop: "20px",
    paddingBottom: "20px",
  },
  bgMedia: {
    marginTop: -40,
    backgroundColor: "#000000",
  },
}));

const HomepageBanner: FC = () => {
  const [loaded, setLoaded] = useState(false);
  const { classes, theme } = useStyles();

  const largerThanMediumScreen = useMediaQuery(
    "(min-width: " + theme.breakpoints.md.toString() + "px)"
  );
  const largerThanSmallScreen = useMediaQuery(
    "(min-width: " + theme.breakpoints.sm.toString() + "px)"
  );

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {loaded && (
        <BackgroundImage
          width={1400}
          height={788}
          url={"/images/takeitaway_header_image-1.jpg"}
          alt={"Take It Away"}
        >
          <div className={classes.dotMatrix}>
            <Container
              size={
                largerThanMediumScreen
                  ? "lg"
                  : largerThanSmallScreen
                  ? "lg"
                  : "sm"
              }
              className={classes.headerContainer}
            >
              <Grid>
                <Grid.Col
                  span={
                    largerThanMediumScreen ? 6 : largerThanSmallScreen ? 8 : 10
                  }
                >
                  <Title>
                    <span className={"specialHeader"}>TAKE IT</span>
                    <br />
                    <span className={"specialHeaderAlt"}>AWAY</span>
                  </Title>
                  <Title className={classes.headerSubText}>
                    Short-term rental and residential on demand trash services
                  </Title>
                </Grid.Col>
                {largerThanMediumScreen && <Grid.Col span={6}></Grid.Col>}
              </Grid>
            </Container>
          </div>
        </BackgroundImage>
      )}
    </>
  );
};

export default React.memo(HomepageBanner);
