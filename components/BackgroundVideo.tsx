import { createStyles, Skeleton } from "@mantine/core";
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
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
}));

const BackgroundVideo = function ({
  children,
  sources,
  posterUrl,
}: {
  children: any;
  sources: Array<{ url: string; mime: string }>;
  posterUrl: string;
}) {
  const { classes } = useStyles();
  const [loaded, setLoaded] = React.useState(false);

  return (
    <Skeleton className={classes.outer} visible={!loaded}>
      <div>
        <video
          className={classes.video}
          poster={posterUrl}
          onLoadedData={() => setLoaded(true)}
          preload="none"
          autoPlay
          disableRemotePlayback
          disablePictureInPicture
          playsInline
          muted
          loop
        >
          {sources.map((s) => {
            return <source key={s.url} src={s.url} type={s.mime} />;
          })}
        </video>
        <div>{children}</div>
      </div>
    </Skeleton>
  );
};

export default React.memo(BackgroundVideo);
