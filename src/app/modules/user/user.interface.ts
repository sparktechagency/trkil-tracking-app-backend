import { Model } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';


interface IAuthenticationProps {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
}

export type IUser = {
    name: string;
    appId: string;
    role: USER_ROLES;
    contact: string;
    email: string;
    password: string;
    country: string;
    city: string;
    occupation: string;
    address: string;
    dateOfBirth: string;
    gender: "Male" | "Female" | "Others";
    profile: string;
    isSubscribed: boolean;
    verified: boolean;
    authentication?: IAuthenticationProps;
}

export type UserModal = {
    isExistUserById(id: string): any;
    isExistUserByEmail(email: string): any;
    isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;