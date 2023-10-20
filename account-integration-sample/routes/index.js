import express from "express";
import * as uiRoute from './ui/index.js'
import * as apiRoute from './api/index.js'
import patRoutes from './pat.routes.js'

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
    path: "/api/qrph",
    route: apiRoute.QRPH,
  },
  {
    path: "/qrph",
    route: uiRoute.QrphTransaction,
  },
  {
    path: "/api/pba",
    route: apiRoute.PBA,
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
  {
    path: "/",
    route: patRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
