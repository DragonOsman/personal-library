// Copyright (c) 2026 Your Name
// Licensed under the GPL v3

import { authClient } from "@/auth-client";

export const updateProfile = async (data: {
  name?: string;
  bio?: string;
}) => {
  const { data: result, error } = await authClient.updateUser(data);
  if (error) {
    const errorMessage = "";
    const { code, message, status, statusText } = error;
    if (code && code !== "") {
      errorMessage.concat(`Error code: ${code}. `);
    } if (message && message !== "") {
      errorMessage.concat(`Error message: ${message}. `);
    }
    errorMessage.concat(`Status: ${status}; status text: ${statusText}`);
    console.error(errorMessage);
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
