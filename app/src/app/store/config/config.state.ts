export enum SmsProvider {
  None = 0,
  Twilio = 1,
}
export enum NotificationMode {
  Email = 1,
  Sms = 2,
  EmailAndSms = 3,
}

export interface ConfigDTO {
  NotificationMode: NotificationMode;
  SendEmails: boolean;
  SmtpHost: string | null;
  SmtpPort: number | null;
  SmtpUseSsl: boolean;
  SmtpUser: string | null;
  SmtpPassword: string | null;
  FromEmail: string | null;
  FromName: string | null;
  SendSms: boolean;
  SmsProvider: SmsProvider;
  TwilioAccountSid: string | null;
  TwilioAuthToken: string | null;
  TwilioFromNumber: string | null;
  DaysBeforeDueToNotify: number;
  NotifyOnDueDate: boolean;
  Active: boolean;
  DefaultPixKey: string | null;
  sPreferredSendTime: string | null;
}

export interface ConfigState {
  config: ConfigDTO;
  loading: boolean;
  error: string | null;
}

export const initialConfigState: ConfigState = {
  config: {
    NotificationMode: NotificationMode.Email,
    SendEmails: false,
    SmtpHost: null,
    SmtpPort: null,
    SmtpUseSsl: false,
    SmtpUser: null,
    SmtpPassword: null,
    FromEmail: null,
    FromName: null,
    SendSms: false,
    SmsProvider: SmsProvider.None,
    TwilioAccountSid: null,
    TwilioAuthToken: null,
    TwilioFromNumber: null,
    DaysBeforeDueToNotify: 0,
    NotifyOnDueDate: false,
    Active: false,
    DefaultPixKey: null,
    sPreferredSendTime: null,
  },
  loading: false,
  error: null,
};
