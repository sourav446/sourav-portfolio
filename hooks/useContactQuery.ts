import { useQuery } from "@tanstack/react-query";
import { ContactPayload, sendContactMessage } from "@/lib/api/contact";

type ContactRequest = {
  id: number;
  payload: ContactPayload;
};

export function useContactQuery(request: ContactRequest | null) {
  return useQuery({
    queryKey: ["contact-submit", request?.id],
    queryFn: () => sendContactMessage(request!.payload),
    enabled: Boolean(request),
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });
}
