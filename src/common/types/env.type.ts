export class CommonConfigs {
  port: number;
  appUrl: string;
}

export class DatabaseConfigs {
  type: string;
  host: string;
  port: string;
  username: string;
  password: string;
  name: string;
}

export class TelegrafConfigs {
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
