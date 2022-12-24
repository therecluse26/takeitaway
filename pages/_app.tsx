import React, { useEffect, useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
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
const Layout = dynamic(() => import('../components/layout'));
const AppSkeleton = dynamic(() => import('../components/app-skeleton'));
const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: {
  Component: any;
  pageProps: any;
}): ReactJSXElement {
  const [hasMounted, setHasMounted] = useState(false);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');
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
            }}
          >
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
