import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(private configService: ConfigService) {}

  async createPaymentOrder(createPaymentDto: CreatePaymentDto) {
    const razorpayKeyId = this.configService.get<string>('RAZORPAY_KEY_ID');

    return {
      order_id: `order_${Date.now()}`,
      amount: createPaymentDto.amount,
      currency: createPaymentDto.currency || 'INR',
      enquiry_id: createPaymentDto.enquiry_id,
      key_id: razorpayKeyId,
      message: 'Payment gateway integration pending. Please implement with your preferred provider.',
    };
  }

  async verifyPayment(paymentId: string, orderId: string) {
    return {
      success: true,
      payment_id: paymentId,
      order_id: orderId,
      message: 'Payment verification pending implementation',
    };
  }
}
