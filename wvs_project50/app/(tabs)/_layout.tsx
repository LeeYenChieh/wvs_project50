import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, OpaqueColorValue } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/containers/hooks/useColorScheme'
import { useSocial } from '@/containers/hooks/useSocial';
import Loading from '@/components/Loading';

export default function TabLayout() {
	const colorScheme = useColorScheme();
	const { user, loadingMessage } = useSocial();
	if (loadingMessage){
		return (
			<Loading text={loadingMessage}/>
		);
	}

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarBackground: TabBarBackground,
				tabBarStyle: Platform.select({
					ios: {
						// Use a transparent background on iOS to show the blur effect
						position: 'absolute',
					},
					default: {},
				}),
			}}>
				<Tabs.Screen
					name="index"
					options={{
						title: 'Home',
						tabBarIcon: ({ color }: {color: string | OpaqueColorValue}) => <IconSymbol size={28} name="house.fill" color={color} />,
					}}
				/>
				<Tabs.Screen
					name="[profile]"
					options={{
						href: {
							pathname: '/[profile]',
							params: {
								profile: user?.username,
							},
						},
						title: 'Profile',
						tabBarIcon: ({ color }: {color: string | OpaqueColorValue}) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
					}}
				/>
		</Tabs>
	);
}
