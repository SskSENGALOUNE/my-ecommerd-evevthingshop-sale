import { CallBackPaymentStatusRequestDto } from './callback-payment-status.request.dto';

export interface ExternalApiRepositoryPort {
  PushPaymentNotification(
    notificationData: CallBackPaymentStatusRequestDto,
  ): Promise<boolean>;
}
