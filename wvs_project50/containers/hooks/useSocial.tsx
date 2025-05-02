import { useContext, createContext, useState, useEffect } from "react";
import { useLogto, type IdTokenClaims } from "@logto/rn";
import { handleError } from "@/lib/sendMessage";
import { useUserApi } from "./useUserApi";
import { saveToCache, loadFromCache, clearCache } from "@/lib/cache";
// getIdTokenClaims
// sub：使用者識別碼
// name
// picture
// iss：Token發行者
// aud：Token接收者
// iat：簽發時間
// exp：到期時間
// auth_time：最近一次通過時間
// creat_at：建立帳號時間
// username：使用者名稱
type SocialContextType = {
    signIn: (redirectUri: string) => Promise<void>;
    signOut: () => Promise<void>;
    client: any;
    isAuthenticated: boolean;
    isInitialized: boolean;
    getIdTokenClaims: () => Promise<IdTokenClaims | undefined>;
    claims: IdTokenClaims;
    setClaims: React.Dispatch<React.SetStateAction<IdTokenClaims | undefined>>;
    user: any;
    setUser: React.Dispatch<React.SetStateAction<any>>;
    roles: any;
    setRoles: React.Dispatch<React.SetStateAction<any>>;
    InitDataSignOut: () => Promise<void>,
    loadingMessage: string | undefined;
    setLoadingMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const SocialContext = createContext<SocialContextType | null>(null);

const SocialProvider = (props: any) => {
    const { signIn, signOut, client, isAuthenticated, isInitialized, getIdTokenClaims } = useLogto();
    const [claims, setClaims] = useState<IdTokenClaims>();
    const [user, setUser] = useState<any>();
    const [roles, setRoles] = useState<any>();
    const [loadingMessage, setLoadingMessage] = useState<string | undefined>(undefined);
    
    const InitDataSignOut = async () => {
        setClaims(undefined);
        setUser(undefined);
        setRoles(undefined);
        setLoadingMessage(undefined);
        await clearCache();
        await signOut();
    }

    const { GetUser, GetRoleToUsers } = useUserApi();

    useEffect(() => {
        const loadCachedData = async () => {
            const cachedClaims = await loadFromCache<IdTokenClaims>("claims");
            const cachedUser = await loadFromCache<any>("user");
            const cachedRoles = await loadFromCache<any>("roles");
        
            if (cachedClaims) setClaims(cachedClaims);
            if (cachedUser) setUser(cachedUser);
            if (cachedRoles) setRoles(cachedRoles);
        };
        loadCachedData();
    }, []);

    useEffect(() => { 
        const fetchAndSaveCacheData = async () => {
            console.log("Loading user data"); 
            
            const newClaims = await getIdTokenClaims().then((res) => {
                setClaims(res);
                return res;
            }).catch(error=>{
                handleError(error, "無法取得用戶資料");
                return undefined;
            });

            if (!newClaims?.sub)
                return
            await saveToCache("claims", newClaims);

            const newUser = await GetUser(newClaims?.sub).then((res) => {
                setUser(res);
                return res;
            }).catch(error => {
                handleError(error, "無法取得用戶資料");
                return undefined;
            });
            await saveToCache("user", newUser);
            
            const newRoles = await GetRoleToUsers(newClaims?.sub).then((res) => {
                setRoles(res);
                return res;
            }).catch(error => {
                handleError(error, "無法取得用戶角色");
                return undefined;
            });
            await saveToCache("roles", newRoles);

            console.log("Loading user data success");
        };
        if (isInitialized && isAuthenticated) {
            void fetchAndSaveCacheData();
        }
    }, [isAuthenticated, getIdTokenClaims, isInitialized]);

    return (
        <SocialContext.Provider
            value={{
                signIn, signOut, client, isAuthenticated, isInitialized, getIdTokenClaims, claims, setClaims, 
                user, setUser, roles, setRoles, InitDataSignOut, loadingMessage, setLoadingMessage
            }}
            {...props}
        />
    );
};

const useSocial = () => {
    const context = useContext(SocialContext);
    if (!context) throw new Error("useSocial must be used within a SocialProvider");
    return context;
};
export { SocialProvider, useSocial };