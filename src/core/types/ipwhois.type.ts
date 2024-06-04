export class IpwhoisResponse {
  readonly ip: string;
  readonly success: boolean;
  readonly type: string;
  readonly continent: string;
  readonly continent_code: string;
  readonly country: string;
  readonly country_code: string;
  readonly region: string;
  readonly region_code: string;
  readonly city: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly flag: {
    readonly img: string;
    readonly emoji: string;
    readonly emogi_unicode: string;
  };
}
