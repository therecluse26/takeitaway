import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import configuration from "../../../../data/configuration";

export default function UserDetail() {
    const router = useRouter();
    const { id } = router.query;
    const { data: user, error } = useQuery([`/api/users/${id}`], 
    () => axios.get(`/api/users/${id}`).then((res) => res.data), 
    {refetchOnWindowFocus: false, staleTime: configuration.cacheStaleTime });
    
    if (error) return <div>failed to load</div>;
    if (!user) return <div>loading...</div>;
    
    return (
        <div>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
        </div>
    );
}