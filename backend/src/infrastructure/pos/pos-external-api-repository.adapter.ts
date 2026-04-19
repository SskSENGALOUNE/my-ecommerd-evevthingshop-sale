import { Inject, Injectable } from '@nestjs/common';
import type { HttpClient } from 'src/application/ports/http-client.port';
import { CallBackPaymentStatusRequestDto } from 'src/domain/payment/callback-payment-status.request.dto';
import { ExternalApiRepositoryPort } from 'src/domain/payment/external-api-repository.port';
import { HttpResponse } from '../http/http.response.dto';

@Injectable()
export class PosExternalApiRepositoryAdapter implements ExternalApiRepositoryPort {
  constructor(
    @Inject('HttpClient')
    private readonly httpClient: HttpClient,
  ) {}

  async PushPaymentNotification(
    notificationData: CallBackPaymentStatusRequestDto,
  ): Promise<boolean> {
    const response: HttpResponse<void> = await this.httpClient.post<
      HttpResponse<void>
    >(
      `${process.env.API_MERCHANT_POS_URL}/payment-notifications`,
      notificationData,
    );
    if (response.status !== 200) {
      return false;
    }
    return true;
  }
}
