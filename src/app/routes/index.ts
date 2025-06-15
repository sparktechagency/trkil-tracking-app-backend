import express from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { BookmarkRoutes } from '../modules/bookmark/bookmark.routes';
import { RuleRoutes } from '../modules/rule/rule.route';
import { FaqRoutes } from '../modules/faq/faq.route';
import { ReviewRoutes } from '../modules/review/review.routes';
import { PlanRoutes } from '../modules/plan/plan.routes';
import { SubscriptionRoutes } from '../modules/subscription/subscription.routes';
import { BannerRoutes } from '../modules/banner/banner.routes';
import { CategoryRoutes } from '../modules/category/category.route';
import { OrderRoutes } from '../modules/order/order.routes';
import { ProductRoutes } from '../modules/product/product.routes';
import { DeviceRoutes } from '../modules/device/device.route';
const router = express.Router();

const apiRoutes = [
    { path: "/user", route: UserRoutes },
    { path: "/auth", route: AuthRoutes },
    { path: "/bookmark", route: BookmarkRoutes },
    { path: "/rule", route: RuleRoutes },
    { path: "/faq", route: FaqRoutes },
    { path: "/review", route: ReviewRoutes },
    { path: "/plan", route: PlanRoutes },
    { path: "/subscription", route: SubscriptionRoutes },
    { path: "/category", route: CategoryRoutes },
    { path: "/banner", route: BannerRoutes },
    { path: "/product", route: ProductRoutes },
    { path: "/order", route: OrderRoutes },
    { path: "/device", route: DeviceRoutes },
]

apiRoutes.forEach(route => router.use(route.path, route.route));
export default router;