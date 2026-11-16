import { useApiQuery } from "@/hooks";

export const dashboard = {
  get: {
    url: "/dashboard",
    method: "GET",
    key: ["dashboard", "get"],
  },
};

export const useDashboard = () =>
  useApiQuery({
    key: dashboard.get.key,
    endpoint: dashboard.get.url,
    method: dashboard.get.method,
  });
