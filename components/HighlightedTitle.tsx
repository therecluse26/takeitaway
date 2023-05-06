import { Center, createStyles, Title } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  titleBackground: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.blue[5]
        : theme.colors.blue[7],
    padding: "1.6rem",
    marginBottom: 60,
  },
  title: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[1],
  },
}));

export default function HighlightedTitle({ title }: { title: string }) {
  const { classes } = useStyles();

  return (
    <div className={classes.titleBackground}>
      <Center>
        <Title className={classes.title} order={3}>
          {title}
        </Title>
      </Center>
    </div>
  );
}
