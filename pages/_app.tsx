import React, { useEffect, useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { NotificationsProvider } from '@mantine/notifications';

import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import GuardContent from '../components/auth-guard';

// Dynamic imports
import dynamic from 'next/dynamic';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Passion_One } from '@next/font/google';
const Layout = dynamic(() => import('../components/layout'));
const AppSkeleton = dynamic(() => import('../components/app-skeleton'));
const queryClient = new QueryClient();

const passionOne = Passion_One({
  weight: '700',
  subsets: ['latin'],
  style: 'normal',
  fallback: ['Helvetica', 'Arial', 'Verdana', 'sans-serif'],
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: {
  Component: any;
  pageProps: any;
}): ReactJSXElement {
  const [hasMounted, setHasMounted] = useState(false);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <div suppressHydrationWarning>
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
            }}
          >
            <NotificationsProvider>
              <SessionProvider session={session}>
                <Authenticated>
                  {hasMounted ? (
                    <Layout>
                      <GuardContent authorization={pageProps.authorization}>
                        <Component {...pageProps} />
                      </GuardContent>
                    </Layout>
                  ) : (
                    <AppSkeleton />
                  )}
                </Authenticated>
              </SessionProvider>
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </QueryClientProvider>
    </div>
  );
}

const Authenticated = ({ children }: { children: any }): ReactJSXElement => {
  const { status } = useSession({ required: false });

  if (status === 'loading') {
    return <AppSkeleton />;
  }

  return children;
};
