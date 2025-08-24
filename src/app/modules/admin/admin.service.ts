import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiErrors';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { USER_ROLES } from '../../../enums/user';
import { Order } from '../order/order.model';
import { Subscription } from '../subscription/subscription.model';

const createAdminToDB = async (payload: IUser): Promise<IUser> => {

    payload.role = USER_ROLES.ADMIN;
    payload.verified = true;

    const createAdmin: any = await User.create(payload);
    if (!createAdmin) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create Admin');
    }
    return createAdmin;
};

const deleteAdminFromDB = async (id: any): Promise<IUser | undefined> => {
    const isExistAdmin = await User.findByIdAndDelete(id);
    if (!isExistAdmin) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete Admin');
    }
    return;
};

const getAdminFromDB = async (): Promise<IUser[]> => {
    const admins = await User.find({ role: 'ADMIN' })
        .select('name email profile contact location');
    return admins;
};


const summeryFromDB = async () => {

    const totalUser = await User.countDocuments({ role: 'USER' });
    const totalSubscriber = await Subscription.countDocuments({ status: 'active' });
    const totalIncome = await Order.aggregate([
        {
            $match: {
                status: "completed",
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$price" }
            }
        }
    ]);
    return {
        totalUser,
        totalSubscriber,
        totalIncome: totalIncome[0]?.total || 0
    };
}

const userStatisticsFromDB = async () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Initialize user statistics array with 0 counts
    const userStatisticsArray = Array.from({ length: 12 }, (_, i) => ({
        month: monthNames[i],
        users: 0
    }));

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

    const usersAnalytics = await User.aggregate([
        {
            $match: {
                role: "USER",
                createdAt: { $gte: startOfYear, $lt: endOfYear }
            }
        },
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    role: "$role",
                },
                total: { $sum: 1 }
            }
        }
    ]);

    // Populate statistics array
    usersAnalytics.forEach(stat => {
        const monthIndex = stat._id.month - 1; // Convert month (1-12) to array index (0-11)
        userStatisticsArray[monthIndex].users = stat.total;
    });

    return userStatisticsArray;
};

const sellingStatisticsFromDB = async () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Initialize user statistics array with 0 counts
    const sellStatisticsArray = Array.from({ length: 12 }, (_, i) => ({
        month: monthNames[i],
        sell: 0
    }));

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

    const sellAnalytics = await Order.aggregate([
        {
            $match: {
                status: "completed",
                createdAt: { $gte: startOfYear, $lt: endOfYear }
            }
        },
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" }
                },
                total: { $sum: "$price" }
            }
        }
    ]);

    // Populate statistics array
    sellAnalytics.forEach(stat => {
        const monthIndex = stat._id.month - 1; // Convert month (1-12) to array index (0-11)
        sellStatisticsArray[monthIndex].sell = stat.total;
    });

    return sellStatisticsArray;
};

const subscriptionStatisticsFromDB = async () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Initialize user statistics array with 0 counts
    const sellStatisticsArray = Array.from({ length: 12 }, (_, i) => ({
        month: monthNames[i],
        amount: 0
    }));

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

    const subscriptionAnalytics = await Subscription.aggregate([
        {
            $match: {
                status: "active",
                createdAt: { $gte: startOfYear, $lt: endOfYear }
            }
        },
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" }
                },
                total: { $sum: "$price" }
            }
        }
    ]);

    // Populate statistics array
    subscriptionAnalytics.forEach(stat => {
        const monthIndex = stat._id.month - 1; // Convert month (1-12) to array index (0-11)
        sellStatisticsArray[monthIndex].amount = stat.total;
    });

    return sellStatisticsArray;
};


export const AdminService = {
    createAdminToDB,
    deleteAdminFromDB,
    getAdminFromDB,
    userStatisticsFromDB,
    sellingStatisticsFromDB,
    subscriptionStatisticsFromDB
};
