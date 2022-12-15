import errorStyles from '../styles/errors/error-styles';
import { HomeButton } from '../components/errors/take-me-home-button';
import { errorMessages }  from '../data/messaging';
import { JSXElementConstructor } from 'react';

import dynamic from 'next/dynamic';
const Title = dynamic(() => import('@mantine/core').then((mod) => mod.Title))
const Text = dynamic(() => import('@mantine/core').then((mod) => mod.Text as JSXElementConstructor<any>))
const Container = dynamic(() => import('@mantine/core').then((mod) => mod.Container))
const Group = dynamic(() => import('@mantine/core').then((mod) => mod.Group))

export default function NotFoundPage() {
  const { classes } = errorStyles();

  return (
    <Container className={classes.root}>
      <div className={classes.label}>
        {errorMessages.pages.notFound.code}
      </div>
      <Title className={classes.title}>
        {errorMessages.pages.notFound.title}
      </Title>
      <Text color="dimmed" size="lg" align="center" className={classes.description}>
       { errorMessages.pages.notFound.description }
      </Text>
      <Group position="center">

        <HomeButton />
      
      </Group>
    </Container>
  );
}