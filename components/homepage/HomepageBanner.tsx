import { createStyles, Grid } from "@mantine/core";
import React, { FC, JSXElementConstructor } from "react";
import { Oswald, Roboto } from "@next/font/google";
import dynamic from "next/dynamic";

const BackgroundImage = dynamic(() =>
  import("@mantine/core").then(
    (mod) => mod.BackgroundImage as JSXElementConstructor<any>
  )
);
const Container = dynamic(() =>
  import("@mantine/core").then(
    (mod) => mod.Container as JSXElementConstructor<any>
  )
);

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

const oswald = Oswald({
  weight: "400",
  subsets: ["latin"],
});

const useStyles = createStyles((theme) => ({
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
    fontFamily: roboto.style.fontFamily,
  },
  dotMatrix: {
    background: "url(/images/dotmatrix.png)",
    backgroundSize: "5px",
    mixBlendMode: "hard-light",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    height: "100%",
    width: "100%",
    position: "relative",
    paddingTop: "20px",
    paddingBottom: "20px",
  },
}));

const HomepageBanner: FC = () => {
  const { classes } = useStyles();

  return (
    <BackgroundImage
      src={"/images/takeitaway.webp"}
      style={{
        marginTop: -40,
        backgroundColor: "#000000",
      }}
    >
      <div className={classes.dotMatrix}>
        <Container>
          <Grid>
            <Grid.Col span={6}>
              <h1>
                <span className={classes.headerText1}>TAKE IT</span>
                <br />
                <span className={classes.headerText2}>AWAY</span>
              </h1>
              <h2 className={classes.headerSubText}>
                Short-term rental and residential on demand trash services
              </h2>
            </Grid.Col>
            <Grid.Col span={6}></Grid.Col>
          </Grid>
        </Container>
      </div>
    </BackgroundImage>
  );
};

export default HomepageBanner;
