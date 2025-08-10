interface ScheduledMessage {
  id: number;
  message: string;
  email: string;
  scheduledDate: string;
  scheduledTime: string;
  createdAt: string;
  status: MessageStatus;
}

type MessageStatus = "pendente" | "enviada" | "falhou" | "cancelada" | "expirada";
/* type MessageStatus = "pending" | "sent" | "failed" | "cancelled" | "expired"; */
