import { model, Schema } from "mongoose";
import { USER_ROLES } from "../../../enums/user";
import { IUser, UserModal } from "./user.interface";
import bcrypt from "bcrypt";
import ApiError from "../../../errors/ApiErrors";
import { StatusCodes } from "http-status-codes";
import config from "../../../config";

const userSchema = new Schema<IUser, UserModal>(
    {
        name: {
            type: String,
            required: false,
        },
        appId: {
            type: String,
            required: false,
            immutable: true
        },
        role: {
            type: String,
            enum: Object.values(USER_ROLES),
            required: true,
        },
        email: {
            type: String,
            required: false,
            unique: true,
            lowercase: true,
        },
        contact: { type: String, required: false },
        password: {
            type: String,
            required: false,
            select: 0,
            minlength: 8,
        },
        address: { type: String, required: false },
        country: { type: String, required: false },
        city: { type: String, required: false },
        occupation: { type: String, required: false },
        dateOfBirth: { type: String, required: false },
        isSubscribed: { type: Boolean, default: false },
        gender: {
            type: String,
            enum: ["Male", "Female", "Others"],
            required: false
        },
        profile: {
            type: String,
            default: 'https://res.cloudinary.com/dzo4husae/image/upload/v1733459922/zfyfbvwgfgshmahyvfyk.png',
        },
        verified: {
            type: Boolean,
            default: false,
        },
        authentication: {
            type: {
                isResetPassword: {
                    type: Boolean,
                    default: false,
                },
                oneTimeCode: {
                    type: Number,
                    default: null,
                },
                expireAt: {
                    type: Date,
                    default: null,
                },
            },
            select: 0
        }
    },
    {
        timestamps: true
    }
)


//exist user check
userSchema.statics.isExistUserById = async (id: string) => {
    const isExist = await User.findById(id);
    return isExist;
};

userSchema.statics.isExistUserByEmail = async (email: string) => {
    const isExist = await User.findOne({ email });
    return isExist;
};


//is match password
userSchema.statics.isMatchPassword = async (password: string, hashPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashPassword);
};

//check user
userSchema.pre('save', async function (next) {
    //check user

    if (this.email) {
        const isExist = await User.findOne({ email: this.email });
        if (isExist) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exist!');
        }
    }


    //password hash
    if (this.password) {
        this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds));
        next();
    }
});
export const User = model<IUser, UserModal>("User", userSchema)