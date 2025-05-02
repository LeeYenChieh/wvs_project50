import { useLogto } from "@logto/rn";
import { BackendURL, API_RESOURCE } from "@/constants/Uri";
import { handleError, handleSuccess } from "@/lib/sendMessage";
import { type IdTokenClaims } from "@logto/rn";
import ApiError from "@/lib/ApiError";

export const useUserApi = () => {
    const { client } = useLogto();

    const api = async (
        path: string, 
        options: RequestInit = {}
    ) => {
        try { 
            // 獲取 API 資源的存取令牌
            const token = await client.getAccessToken(API_RESOURCE);
            if (!token) {
                throw new ApiError("獲取存取令牌失敗", 401);  
            }
            const response = await fetch(`${BackendURL}${path}`, {
                ...options, 
                headers: {
                    'Content-Type': 'application/json',
                    // 將存取令牌添加到請求標頭
                    'Authorization': `Bearer ${token}`,
                    ...options.headers,
                },
            });

            let data;
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const DataText = await response.text(); // HTML 或其他格式
                data = { "message": DataText };
            }

            if (!response.ok){
                console.log(response)
                throw new ApiError(data.message || "伺服器錯誤", response.status, data);
            }
            
            return data;
        } catch (error) {
            console.log(error)
            throw error;
        }
    };

    const GetUser = async (userId: string) => {
        const response = await api(`/api/users/${userId}`).then((res) => {
            console.log(`${userId} get user success`)
            return res;
        }).catch(error => { 
            console.log(`${userId} get user fail`)
            throw error 
        });
        return response;
    };

    const UpdateUser = async (userId: string, userData: any) => {
        const response = await api(`/api/users/${userId}`, {
            method: 'PATCH',
            body: JSON.stringify({userData}),
        }).then((res) => {
            console.log(`${userId} update user data ${userData} success`);
            return res;
        }).catch(error => { 
            console.log(`${userId} update user data ${userData} fail`);
            throw error 
        });
        return response;
    };

    const GetUserCustomData = async (userId: string) => {
        const response = await api(`/api/users/${userId}/custom-data`).then((res) => {
            console.log(`${userId} get user custom data success`)
            return res;
        }).catch(error => { 
            console.log(`${userId} get user custom data fail`)
            throw error 
        });
        return response;
    }

    const UpdateUserCustomData = async (userId: string, customData: any) => {
        const response = await api(`/api/users/${userId}/custom-data`, {
            method: 'PATCH',
            body: JSON.stringify({ "customData": customData }),
        }).then((res) => {
            console.log(`${userId} update user custom data ${customData} success`);
            return res;
        }).catch(error => { 
            console.log(`${userId} update user custom data ${customData} fail`);
            throw error 
        });
        return response;
    };

    const GetRoleToUsers = async (userId: string) => {
        const response = await api(`/api/users/${userId}/roles`).then((res) => {
            console.log(`${userId} get user roles success`);
            return res;
        }).catch(error => { 
            console.log(`${userId} get user roles fail`);
            throw error 
        });
        return response;
    };

    const UpdateRoleToUsers = async (userId: string, roles: string[], email: string) => {
        await api(`/api/users/${userId}/roles`, {
            method: 'PUT',
            body: JSON.stringify({ roles, email }),
        }).then(() => {
            console.log(`${userId} update user roles ${roles} with email ${email} success`);
            return;
        }).catch(error => { 
            console.log(`${userId} update user roles ${roles} with email ${email} fail`)
            throw error 
        });
        return;
    };

    const AssignRoleToUsers = async (userId: string, roles: string[], email: string) => {
        await api(`/api/users/${userId}/roles`, {
            method: 'POST',
            body: JSON.stringify({ roles, email }),
        }).then(() => {
            console.log(`${userId} assign user roles ${roles} with email ${email} success`);
            return;
        }).catch(error => { 
            console.log(`${userId} assign user roles ${roles} with email ${email} fail`)
            throw error 
        });
        return;
    };

    const handleUpdataUser = async (userId: string, userData: any, setUser: React.Dispatch<React.SetStateAction<any>>) => {
        await UpdateUser(userId, userData).then((res) => {
            setUser((prev: any) => ({
                ...prev,
                ...userData
            }))
            handleSuccess("操作成功", "資料已更新");
        }).catch(error => {
            handleError(error, error.message ?? "修改用戶資料失敗");
            throw error;
        })
    }

    const handleUpdateCustomData = async (userId: string, customData: any, setUser: React.Dispatch<React.SetStateAction<any>>) => {
        await UpdateUserCustomData(userId, customData).then((res) => {
            setUser((prev: any) => ({
                ...prev,
                "customData": customData
            }))
            handleSuccess("操作成功", "資料已更新");
        }).catch(error => {
            handleError(error, error.message ?? "修改用戶資料失敗");
            throw error;
        })
    }

    const handleUpdateRoles = async (userId: string, roles: string[], setRoles: React.Dispatch<React.SetStateAction<any>>, email: string) => {
        await UpdateRoleToUsers(userId, roles, email).then(() => {
            setRoles(roles);
            handleSuccess("操作成功", `角色為${roles}`);
        }).catch(error => {
            handleError(error, error.message ?? "修改角色失敗");
            throw error;
        });
    };

    return { GetUser, UpdateUser, GetUserCustomData, UpdateUserCustomData, 
        GetRoleToUsers, UpdateRoleToUsers, AssignRoleToUsers, 
        handleUpdataUser, handleUpdateCustomData, handleUpdateRoles };
};