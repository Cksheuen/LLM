import * as GoogleProtobufField_mask from "./google/protobuf/field_mask.pb";

export type UserInfoUpdateRequest = {
  nickName?: string;
  signature?: string;
  avatar?: string;
  school?: string;
  birth?: string;
  sex?: number;
  updateMask?: GoogleProtobufField_mask.FieldMask;
};

export type ModelUserPublicView = {
  id?: string;
  nickName?: string;
  avatar?: string;
  signature?: string;
};

export type UserInfo = {
  avatar: string;
  ban: boolean;
  banReason: string;
  birth: string;
  createdAt: string;
  email: string;
  id: string;
  lastIP: string;
  location: string;
  nick_name: string;
  phone: string;
  phoneArea: string;
  school: string;
  sex: number;
  signature: string;
  bindInfo?: {[key: string]: string}
  [k: string]: string | number | boolean;
};

export type PhoneRegisterRequest = {
  phone: string;
  password: string;
  code: string;
};

export type GeneralLoginV2Request = {
  /**
   * 阿里云验证码
   */
  captcha: string;
  info: string;
  password: string;
  /**
   * phone或email
   */
  type: string;
};

export interface GeneralLoginResponse {
  expireIn: number;
  refreshToken: string;
  refreshTokenExpireIn: number;
  token: string;
  status: "待扫码" | "已扫码" | "";
}

export interface GeneralLoginV2Response {
  auth?: GeneralLoginResponse;
  captchaResult: boolean;
}

export type PhoneSmsLoginRequest = {
  phone: string;
  code: string;
};

export type MailCodeLoginRequest = {
  mail: string;
  code: string;
};

export type MailCodeBindRequest = {
  email: string;
  code?: string;
};

export interface PhoneCodeV2Request {
  captcha: string;
  phone: string;
  /**
   * register/reset/login
   */
  service: string;
}

export interface PhoneCodeV2Response {
  captchaResult: boolean;
  sendStatus: boolean;
  message: string;
}

export interface CodeV3Request {
  captcha: string;
  info: string;
  /**
   * phone/mail
   */
  infoType: string;
  /**
   * register/reset/login/bind
   */
  service: string;
}

export interface SignUpRequest {
  phone: string;
  password: string;
  code: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  expireIn: string;
  refreshToken: string;
}

export interface CheckThirdJumpRequest {
  callback: string | null;
  code: string | null;
  ticket: string | null;
  state: string | null;
}

export interface ResetPwdRequest {
  phone: string;
  password: string;
  code: string;
}

export type UserBaseType = {
  id: string;
  nickName: string;
  avatar: string;
  signature: string;
};

export type GeneralBindInfoRequest = {
  type: string;
  info: string;
  code: string;
  force: boolean;
}

export type QRCodeResponse = {
  image: string;
  message: string;
}


/**
 * 创建者 1;共同编辑 2;完全共享用户 3;限时共享用户 4
 */
export enum UserRoleType {
  CREATOR = 1,
  SHARE_EDIT = 2,
  SHARE_ALL = 3,
  SHARE_LIMIT = 4,
}
export enum PublishType {
  OFFICIAL = 1,
  PUBLIC = 2,
  PRIVATE = 3,
}
const PublishTypeMap = ['官方', '公开', '私有']
export enum SharePermissionType {
  ANYONE = 1,
  MANAGER = 2,
  CREATOR = 3,
}