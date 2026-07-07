// Validate token via backend API
export async function validateToken(
  token: string,
  backendUrl: string,
): Promise<boolean> {
  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    return data.valid;
  } catch (error) {
    console.error("Token validation failed:", error);
    return false;
  }
}

// Fetch user data from backend
export async function getUserData(token: string): Promise<any> {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/user-data`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
}

// Returns true if at least one match is found, false otherwise
export const CheckPermission = ({
  permissions,
  flatPermissions,
}: {
  permissions: string[];
  flatPermissions: { id: number; name: string }[];
}): boolean => {
  // Create a Set for O(1) lookups to keep it performant
  let availableNames: Set<string> | null = new Set(
    flatPermissions.map((p) => p.name),
  );

  // Check if every requested permission is in that Set
  const result = permissions.every((perm) => availableNames?.has(perm));
  availableNames = null;
  return result;
};
