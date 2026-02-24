import { apiRequest } from "@/lib/queryClient";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactResponse = {
  ok: boolean;
  emailSent: boolean;
  smsSent: boolean;
};

export async function sendContactMessage(payload: ContactPayload): Promise<ContactResponse> {
  const response = await apiRequest("POST", API_ENDPOINTS.contactDetails, payload);
  return response.json() as Promise<ContactResponse>;
}
