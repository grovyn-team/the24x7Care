import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Public()
  @Post('create-order')
  @ApiOperation({ summary: 'Create payment order' })
  async createOrder(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPaymentOrder(createPaymentDto);
  }

  @Public()
  @Post('verify')
  @ApiOperation({ summary: 'Verify payment' })
  async verifyPayment(@Body() body: { payment_id: string; order_id: string }) {
    return this.paymentService.verifyPayment(body.payment_id, body.order_id);
  }
}
