import { useSocial } from '@/containers/hooks/useSocial'
import { Button, StyleSheet } from "react-native";
import { ThemedView } from '@/components/ThemedView';
import Loading from '@/components/Loading';
import { useRouter } from "expo-router";

import { useEffect } from 'react';

const App = () => {
    const { isInitialized, isAuthenticated, roles, InitDataSignOut } = useSocial();
    const router = useRouter();

    useEffect(() => {
        if((isInitialized && !isAuthenticated) || (isInitialized && isAuthenticated && roles?.length == 0)){
            console.log("前往 /singin")
            router.replace("/signin");
        }
    },[isInitialized, isAuthenticated, roles])

    return (
        <>
            {(!isInitialized || !isAuthenticated) && <Loading text="" />}
            <ThemedView style={styles.container}>
                <Button
                    title="break"
                    onPress={() => { InitDataSignOut ()}}
                />
            </ThemedView>
        </>
    )
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // marginHorizontal: 16,
    }
});
export default App;