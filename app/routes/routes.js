import { Router } from "express";

import { router as addressesRouter } from "../api/addresses/route.js";
import { router as addressUpdateRouter } from "../api/address/update/route.js";
import { router as ordersRouter } from "../api/orders/route.js";
import { router as orderRouter } from "../api/order/route.js";
import { router as cancelOrderRouter } from "../api/order/cancel/route.js";

export const rootRouter = Router();

rootRouter.use("/addresses", addressesRouter);
rootRouter.use("/address/update", addressUpdateRouter);
rootRouter.use("/orders", ordersRouter);
rootRouter.use("/order", orderRouter);
rootRouter.use("/order/cancel", cancelOrderRouter);

