import { Router } from "express";

export const staticRouter = Router();

staticRouter.get("/", (req, res) => {
    return res.render("page");
});