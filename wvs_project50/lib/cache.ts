import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToCache = async (key: string, data: any) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.log("快取儲存失敗", error);
    }
};

export const loadFromCache = async <T = any>(key: string): Promise<T | null> => {
    try {
        const json = await AsyncStorage.getItem(key);
        return json ? JSON.parse(json) : null;
    } catch (error) {
        console.log("快取讀取失敗", error);
        return null;
    }
};

export const clearCache = async () => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.log("快取清除失敗", error);
    }
};
