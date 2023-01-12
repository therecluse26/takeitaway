/* eslint-disable @next/next/no-title-in-document-head */
import { createGetInitialProps } from '@mantine/next';
import Document, { Html, Head, Main, NextScript } from 'next/document';

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html lang="en">
        <Head>
          <title>{process.env.APP_NAME}</title>
          <meta
            name="description"
            content="Take it Away is a residential and short-term rental on demand trash services-based business. We have subscription services available for customers that may own one, or multiple rental properties that are rented out on a short-term basis (i.e. Airbnb, Vrbo, etc.) and need on demand trash services where the trash is picked up after your rental is complete, or, if you are a residential customer that just forgot to take the trash out on your scheduled city day and need someone to just Take It Away, then we are the company for you!"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
