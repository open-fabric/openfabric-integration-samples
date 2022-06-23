import { GetAccessToken } from "../services/auth.js";
import { catchAsync } from "../utils/catchAsync";

export const OpenFabricAuthentication = catchAsync(async (req, res) => {
  const token = await GetAccessToken(req.body.scope);
  res.status(200).json(token);
});
