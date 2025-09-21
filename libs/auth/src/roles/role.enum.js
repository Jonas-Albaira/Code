// libs/auth/src/roles/role.enum.ts
export var Role;
(function (Role) {
    Role["Owner"] = "Owner";
    Role["Admin"] = "Admin";
    Role["Viewer"] = "Viewer";
})(Role || (Role = {}));
// Define which roles inherit from which
export const RoleHierarchy = {
    [Role.Owner]: [Role.Admin, Role.Viewer],
    [Role.Admin]: [Role.Viewer],
    [Role.Viewer]: [],
};
//# sourceMappingURL=role.enum.js.map