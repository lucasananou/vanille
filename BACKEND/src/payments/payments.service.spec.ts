import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  const configServiceMock = {
    get: jest.fn((key: string, fallback?: string) => {
      const values: Record<string, string> = {
        STRIPE_SECRET_KEY: 'sk_test_mock',
        PAYPAL_CLIENT_ID: 'paypal_client_mock',
        PAYPAL_CLIENT_SECRET: 'paypal_secret_mock',
        PAYPAL_ENV: 'sandbox',
      };

      return values[key] ?? fallback;
    }),
  };
  const ordersServiceMock = {
    create: jest.fn(),
  };
  const prismaServiceMock = {
    shippingRate: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
        {
          provide: OrdersService,
          useValue: ordersServiceMock,
        },
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
