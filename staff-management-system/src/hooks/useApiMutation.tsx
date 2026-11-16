import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";

interface UseApiMutationParams {
  endpoint: string;
  method?: string;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  headers?: Record<string, string>;
  options?: Record<string, unknown>;
}

export function useApiMutation({
  endpoint,
  method = "POST",
  onSuccess,
  onError,
  headers = {},
  options = {},
}: UseApiMutationParams) {
  return useMutation({
    mutationFn: (body: Record<string, unknown> | FormData) => api(endpoint, { method, body, headers }),
    onSuccess,
    onError,
    ...options,
  });
}
