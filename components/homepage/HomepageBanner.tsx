import { Container, createStyles, Grid, Title } from "@mantine/core";
import React, { FC, useEffect, useState } from "react";
import BackgroundVideo from "../BackgroundVideo";

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
  const { classes } = useStyles();

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {loaded && (
        <BackgroundVideo
          sources={[
            { url: "/images/takeitaway_hero.webm", mime: "video/webm" },
            { url: "/images/takeitaway_hero.mp4", mime: "video/mp4" },
          ]}
          posterUrl={"/images/takeitaway_hero_firstframe.jpg"}
        >
          <div className={classes.dotMatrix}>
            <Container className={classes.headerContainer}>
              <Grid>
                <Grid.Col span={6}>
                  <Title>
                    <span className={"specialHeader"}>TAKE IT</span>
                    <br />
                    <span className={"specialHeaderAlt"}>AWAY</span>
                  </Title>
                  <Title order={2} className={classes.headerSubText}>
                    Short-term rental and residential on demand trash services
                  </Title>
                </Grid.Col>
                <Grid.Col span={6}></Grid.Col>
              </Grid>
            </Container>
          </div>
        </BackgroundVideo>
      )}
    </>
  );
};

export default React.memo(HomepageBanner);
