import express from "express";
import * as uiRoute from './ui'
import * as apiRoute from './api'

const router = express.Router();

const defaultRoutes = [
  {
    path: "/api/orchestrated",
    route: apiRoute.Orchestrated,
  },
  {
    path: "/orchestrated",
    route: uiRoute.OrchestratedCheckout,
  },
  {
    path: "/api/of-auth",
    route: apiRoute.OFAuth,
  },
  {
    path: "/api/callback",
    route: apiRoute.WebhookCallback,
  },
  {
    path: "/api/embedded",
    route: apiRoute.Embedded,
  },
  {
    path: "/api/unilateral",
    route: apiRoute.Unilateral,
  },
  {
    path: "/embedded",
    route: uiRoute.EmbeddedCheckout,
  },
  {
    path: "/utitlies",
    route: apiRoute.DbController,
  },
];
defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
