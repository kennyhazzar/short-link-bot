export class CommonConfigs {
  port: number;
  appUrl: string;
}

export class DatabaseConfigs {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
}

export class TelegrafConfigs {
  adminTelegramId: number;
  token: string;
  url: string;
}

export class RedisConfigs {
  host: string;
  port: number;
}

export class IpwhoisConfigs {
  url: string;
}

export class ThrottlerConfigs {
  ttl: number;
  limit: number;
}

export class HttpConfigs {
  timeout: number;
  maxRedirects: number;
}
