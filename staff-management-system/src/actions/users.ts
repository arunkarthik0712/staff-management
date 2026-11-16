import { useApiQuery } from "@/hooks";

export const users = {
  add: {
    url: "/users",
    method: "POST",
    key: ["users", "add"],
  },
  edit: {
    url: "/users",
    method: "PUT",
    key: ["users", "edit"],
  },
  delete: {
    url: "/users",
    method: "DELETE",
    key: ["users", "delete"],
  },
  getById: (id: string) => ({
    url: `/users?id=${id}`,
    method: "GET",
    key: ["users", "id", id],
  }),
  getPaginated: {
    url: "/users",
    method: "GET",
    key: ["users", "paginated"],
  },
  getAll: {
    url: "/users",
    method: "GET",
    key: ["users", "all"],
  },
};

export const useUsers = () =>
  useApiQuery({
    key: users.getAll.key,
    endpoint: users.getAll.url,
    method: users.getAll.method,
  });

export const useUsersById = (id: string) =>
  useApiQuery({
    key: users.getById(id).key,
    endpoint: users.getById(id).url,
    method: users.getById(id).method,
  });
