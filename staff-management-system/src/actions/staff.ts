export const staffActions = (section: string) => ({
  add: {
    url: `/staff/${section}`,
    method: "POST",
    key: ["staff", section, "add"],
  },
  update: {
    url: `/staff/${section}`,
    method: "PUT",
    key: ["staff", section, "update"],
  },
  delete: {
    url: `/staff/${section}`,
    method: "DELETE",
    key: ["staff", section, "delete"],
  },
  getPaginated: {
    url: `/staff/${section}`,
    method: "GET",
    key: ["staff", section],
  },
  getAll: {
    url: `/staff/${section}`,
    method: "GET",
    key: ["staff", section, "all"],
  },
});
