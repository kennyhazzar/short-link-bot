import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    return (
      (req.headers['x-real-ip'] as string) ||
      (req.headers['x-forwarded-for'] as string)
    );
  }
}
