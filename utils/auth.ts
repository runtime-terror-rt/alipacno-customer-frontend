export function isCustomerUser(user: any): boolean {
  if (!user || typeof user !== "object") return true;

  const userType = (
    user?.user_type ||
    user?.role_type ||
    user?.role_name ||
    user?.type ||
    (typeof user?.role === "string" ? user?.role : user?.role?.name || user?.role?.title) ||
    ""
  )
    .toString()
    .toLowerCase();

  const roleId = user?.role_id ?? (typeof user?.role === "object" ? user?.role?.id : undefined);

  // If user_type or role string is specified, verify it is "customer"
  if (userType && userType !== "customer") {
    return false;
  }

  // If role_id is specified, verify it matches customer role ID (8)
  if (roleId !== undefined && roleId !== null && roleId !== "") {
    const numRoleId = Number(roleId);
    if (!isNaN(numRoleId) && numRoleId !== 8) {
      return false;
    }
  }

  return true;
}
