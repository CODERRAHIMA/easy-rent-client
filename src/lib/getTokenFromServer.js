import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * @returns {Promise<string>}
 */
export async function getTokenFromServer() {
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });

  if (!token) {
    throw new Error("Failed to get authentication token");
  }

  return token;
}
