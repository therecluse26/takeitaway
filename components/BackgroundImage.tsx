import { createStyles, Skeleton } from "@mantine/core";
import Image from "next/image";
import React from "react";

const useStyles = createStyles((theme) => ({
  outer: {
    position: "relative",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "block",
    width: "100%",
    border: 0,
    marginTop: 0,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
  },
  imageClass: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
}));

const BackgroundImage = function ({
  width,
  height,
  children,
  alt,
  url,
}: {
  width: number;
  height: number;
  children: any;
  alt: string;
  url: string;
}) {
  const { classes } = useStyles();
  const [loaded, setLoaded] = React.useState(false);

  return (
    <Skeleton className={classes.outer} visible={!loaded}>
      <div>
        <Image
          className={classes.imageClass}
          onLoad={() => setLoaded(true)}
          src={url}
          alt={alt}
          width={width}
          height={height}
          priority={true}
        />
        <div>{children}</div>
      </div>
    </Skeleton>
  );
};

export default React.memo(BackgroundImage);
