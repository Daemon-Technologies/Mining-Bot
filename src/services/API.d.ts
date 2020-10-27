declare namespace API {
  export interface UserInfo {
    password?: string;
  }

  export interface RequestResult {
    data?: any,
    status: number;
  }

  export interface LoginStateType {
    status?: number;
    type?: string;
  }

  export interface NoticeIconData {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  }

  export interface TokenInfo {
    type: string;
    value: string;
  }
}
