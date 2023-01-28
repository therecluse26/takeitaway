import React, { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { NotificationsProvider } from '@mantine/notifications';

import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import GuardContent from '../components/auth-guard';

// Dynamic imports
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '../components/layout';
import { Oswald, Passion_One } from '@next/font/google';

const queryClient = new QueryClient();

const passionOne = Passion_One({
  weight: '700',
  subsets: ['latin'],
  style: 'normal',
  fallback: ['Helvetica', 'Arial', 'Verdana', 'sans-serif'],
});

const oswald = Oswald({
  weight: '400',
  subsets: ['latin'],
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: {
  Component: any;
  pageProps: any;
}): ReactJSXElement {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <div suppressHydrationWarning>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
          >
            <MantineProvider
              withGlobalStyles
              withNormalizeCSS
              theme={{
                /** Put your mantine theme override here */
                colorScheme: colorScheme,
                headings: {
                  fontFamily: passionOne.style.fontFamily,
                  sizes: {
                    h1: { fontWeight: 100, fontSize: 52, lineHeight: 1.2 },
                    h2: { fontSize: 42, lineHeight: 1.2 },
                    h3: { fontSize: 36, lineHeight: 1.2 },
                    h4: { fontSize: 24, lineHeight: 1.2 },
                    h5: { fontSize: 18, lineHeight: 1.2 },
                    h6: { fontWeight: 900 },
                  },
                },

                globalStyles: (theme) => ({
                  '.specialHeader': {
                    fontFamily: oswald.style.fontFamily,
                    color: 'rgb(0, 122, 255)',
                    fontSize: '154px',
                    lineHeight: '160px',
                    fontWeight: 700,
                    [theme.fn.smallerThan('md')]: {
                      fontSize: '94px',
                      lineHeight: '100px',
                    },
                  },
                  '.specialHeaderAlt': {
                    fontFamily: oswald.style.fontFamily,
                    color: theme.colors.green[5],
                    fontSize: '154px',
                    fontWeight: 300,
                    fontStyle: 'extra-light',
                    lineHeight: '160px',
                    [theme.fn.smallerThan('md')]: {
                      fontSize: '94px',
                      lineHeight: '100px',
                    },
                  },
                }),
              }}
            >
              
              <NotificationsProvider>
                <Layout>
                  <GuardContent authorization={pageProps.authorization}>
                    <Component {...pageProps} />
                  </GuardContent>
                </Layout>
              </NotificationsProvider>
            </MantineProvider>
          </ColorSchemeProvider>
        </QueryClientProvider>
      </SessionProvider>
    </div>
  );
}
