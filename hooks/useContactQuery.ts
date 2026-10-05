import { useMutation } from "@tanstack/react-query";
import { sendContactMessage } from "@/lib/api/contact";

export function useContactMutation() {
  return useMutation({ mutationFn: sendContactMessage });
}
