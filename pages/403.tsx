import { Title, Text, Container, Group } from '@mantine/core';
import errorStyles from '../styles/errors/error-styles';
import { HomeButton } from '../components/errors/take-me-home-button';
import { errorMessages } from '../data/messaging';

export default function NotAuthorizedPage() {
  const { classes } = errorStyles();

  return (
    <Container className={classes.root}>
      <div className={classes.label}>
        {errorMessages.pages.unauthorized.code}
      </div>
      <Title className={classes.title}>
        {errorMessages.pages.unauthorized.title}
      </Title>
      <Text color="dimmed" size="lg" align="center" className={classes.description}>
        {errorMessages.pages.unauthorized.description}
      </Text>
      <Group position="center">
          <HomeButton />
      </Group>
    </Container>
  );
}