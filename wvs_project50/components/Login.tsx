import { type IdTokenClaims } from '@logto/rn';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { RedirectUri } from "@/constants/Uri";

const Login = ({ client, claims, signIn, signOut, isAuthenticated }: {
    client: any;
    claims: IdTokenClaims;
    signIn: (redirectUri: string) => Promise<void>;
    signOut: () => Promise<void>;
    isAuthenticated: boolean;
}) => {
    return (
        <ThemedView style={styles.container}>
            <ThemedText type='default'>App ID: {client.logtoConfig.appId}</ThemedText>
            <Button title="Sign in" onPress={async () => signIn(RedirectUri)} />
            {/* eslint-disable-next-line react/style-prop-object */}
            <StatusBar style="auto" />
        </ThemedView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});