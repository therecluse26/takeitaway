import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { getUserWithRelations, UserWithRelations } from "../services/api/ApiUserService";

export default async function getSessionUserProps(context: GetServerSidePropsContext) {
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
      );
    
      if (!session) {
        return {
          redirect: {
            destination: '/api/auth/signin',
            permanent: false,
          },
        };
      }
      const user: UserWithRelations | false = await getUserWithRelations(
        session?.user?.id as string
      )
        .then((res) => JSON.parse(JSON.stringify(res)))
        .catch((err) => {
          console.error(err);
          return false;
        });
    
      if (user === false) {
        return {
          notFound: true,
        };
      }
    
      return {
        props: {
          user: user,
          authorization: {
            requiresSession: true,
          },
        },
      };
}