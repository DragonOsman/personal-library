import { authClient } from "@/src/auth-client";

export const updateProfile = async (data: {
  name?: string;
}) => {
  const { data: result, error } = await authClient.updateUser(data);
  if (error) {
    const { code, message, status, statusText } = error;
    if ((code && code !== "") && (message && message !== "") && status > 0 && statusText !== "") {
      throw new Error(`Error Code: ${code} - ${message} (${status}: ${statusText})`);
    }
  }
  return result;
};

export const linkedAccounts = async () => {
  const { data, error } = await authClient.listAccounts();

  if (error) {
    const { code, message, status, statusText } = error;
    if ((code && code !== "") && (message && message !== "") && status > 0 && statusText !== "") {
      throw new Error(`Error Code: ${code} - ${message} (${status}: ${statusText})`);
    }
  }
  return data || [];
};

export const unlinkAccount = async (providerId: string, accountId: string) => {
  const { data, error } = await authClient.unlinkAccount({
    providerId,
    accountId
  });

  if (error) {
    const { code, message, status, statusText } = error;
    if ((code && code !== "") && (message && message !== "") && status > 0 && statusText !== "") {
      throw new Error(`Error Code: ${code} - ${message} (${status}: ${statusText})`);
    }
  }
  return data;
};
