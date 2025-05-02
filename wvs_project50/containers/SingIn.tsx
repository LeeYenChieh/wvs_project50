import { useSocial } from "@/containers/hooks/useSocial";
import { useRouter } from "expo-router";
import Login from "@/components/Login";
import ChooseRole from "./ChooseRole";
import Loading from "@/components/Loading";
import { useEffect } from "react";

const SignIn = () => {
    const {isAuthenticated, client, claims, signIn, InitDataSignOut, isInitialized, roles, loadingMessage} = useSocial();
    const router = useRouter();

    useEffect(() => {
        if(isInitialized && isAuthenticated && roles?.length > 0){
            console.log("前往 /")
            router.replace('/')
        }
    },[isInitialized, isAuthenticated, roles])

    if (!isInitialized)
        return <Loading text={loadingMessage} />
    else if(!isAuthenticated){
        return (
            <Login client={client} claims={claims} signIn={signIn} signOut={InitDataSignOut} isAuthenticated={isAuthenticated} />
        );
    } else if (!roles || roles?.length == 0){
        return (
            <>
                {(loadingMessage != undefined) && <Loading text={loadingMessage} />}
                <ChooseRole />
            </>
        );
    }

    return null;
};   

export default SignIn;  