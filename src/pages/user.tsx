import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const User = () => {
    const router = useRouter();

    const session = useSession({
        onUnauthenticated() {
            router.push({
                pathname: "/login",
                query: {
                    redirect: router.pathname
                }
            })
        },
        required: true
    });

    return <div>{session.status === "authenticated" ? JSON.stringify(session.data.user) : null}</div>
}

export default User;