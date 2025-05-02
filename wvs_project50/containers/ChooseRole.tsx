import { Button, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useSocial } from "./hooks/useSocial";
import { useUserApi } from "./hooks/useUserApi";
import { UserRole } from "@/constants/Roles";
import { saveToCache } from "@/lib/cache";
import { useRef, useEffect } from "react";
import { handleError } from "@/lib/sendMessage";
import ApiError from "@/lib/ApiError";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ChooseRole = () => {
    const { claims, setRoles, user, setLoadingMessage } = useSocial();
    const { handleUpdateRoles } = useUserApi();

    const userRef = useRef(user);

    useEffect(() => {
        userRef.current = user;
    }, [user]);

    const waitForEmail = async (timeoutMs = 5000) => {
        const start = Date.now();
    
        while (Date.now() - start < timeoutMs) {
            let currentUser = userRef.current
            if (currentUser?.primaryEmail) {
                return currentUser.primaryEmail;
            }
            await sleep(100);
        }
        throw new ApiError("等候email超時", 404);
    };

    const handleSelectRole = async (role: UserRole) => {
        try {
            let email = user?.primaryEmail;
            if (role === UserRole.Admin && !email) {
                setLoadingMessage("確認使用者資料中");
                email = await waitForEmail().catch(error => {
                    handleError(error);
                });
            }
            if (!email)
                return;
        
            setLoadingMessage("更新角色中");
            await handleUpdateRoles(claims?.sub, [role], setRoles, email);
            await saveToCache("roles", [role]);
        } catch (error) {
            handleError(error, "操作失敗");
        } finally {
            setLoadingMessage(undefined);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <Button
                title="Teacher"
                onPress={() => handleSelectRole(UserRole.Admin)}
            />
            <Button
                title="Student"
                onPress={() => handleSelectRole(UserRole.User)}
            />
        </ThemedView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default ChooseRole;