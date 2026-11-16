import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";

interface UseApiQueryParams {
  key: string | string[];
  endpoint: string;
  method?: string;
  queryParams?: Record<string, string>;
  enabled?: boolean;
  options?: Record<string, unknown>;
}

export function useApiQuery({
  key,
  endpoint,
  method = "GET",
  queryParams = {},
  enabled = true,
  options = {},
}: UseApiQueryParams) {
  return useQuery({
    queryKey: [key, queryParams],
    queryFn: () => api(endpoint, { method, queryParams }),
    enabled,
    ...options,
  });
}
