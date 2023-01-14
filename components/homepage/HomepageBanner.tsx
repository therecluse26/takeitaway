import { Container, createStyles, Grid, Title } from "@mantine/core";
import React, { FC } from "react";
import { Oswald } from "@next/font/google";
import BackgroundVideo from "../BackgroundVideo";

const oswald = Oswald({
  weight: "400",
  subsets: ["latin"],
});

const useStyles = createStyles((theme) => ({
  headerContainer: {
    paddingTop: "40px",
    paddingBottom: "40px",
  },

  headerText1: {
    color: "rgb(0, 122, 255)",
    fontSize: "154px",
    lineHeight: "160px",
    fontWeight: 700,
    fontFamily: oswald.style.fontFamily,
  },
  headerText2: {
    color: theme.colors.green[5],
    fontSize: "154px",
    fontWeight: 300,
    fontStyle: "extra-light",
    lineHeight: "160px",
    fontFamily: oswald.style.fontFamily,
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
  const { classes } = useStyles();

  return (
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
                <span className={classes.headerText1}>TAKE IT</span>
                <br />
                <span className={classes.headerText2}>AWAY</span>
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
  );
};

export default React.memo(HomepageBanner);
