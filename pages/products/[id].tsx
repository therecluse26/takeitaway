import { GetServerSideProps } from 'next';
import { Service } from '@prisma/client';
import { getServiceById } from '../../lib/services/api/ApiServiceService';

export default function ProductDetail(props: { service: Service }) {
  return (
    <>
      <h1>{props.service.name}</h1>
      <p dangerouslySetInnerHTML={{ __html: props.service.description }}></p>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context?.params?.id) {
    return {
      notFound: true,
    };
  }

  const service: Service | false = await getServiceById(
    context?.params?.id as string
  )
    .then((res) => JSON.parse(JSON.stringify(res)))
    .catch((err) => {
      console.error(err);
      return false;
    });

  if (service === false) {
    return {
      notFound: true,
    };
  }

  return {
    props: { service: service },
  };
};
