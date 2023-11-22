export class InsertUserDto {
  telegramId: number;
  username?: string;
  email?: string;
  languageCode?: string;
}

export class UpdateUserDto {
  languageCode?: string;
}
