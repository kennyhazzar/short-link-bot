export class CommonConfigs {
  port: number;
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
  groupId: number;
  botToken: string;
}

export class RedisConfigs {
  host: string;
  port: number;
}

export class IpwhoisConfigs {
  url: string;
}
