import { catchAsync } from "../utils/catchAsync";
import { GetAccessToken } from "../services/auth";

export const OpenFabricAuthentication = catchAsync(async (req, res) => {
  const token = await GetAccessToken();
  res.status(200).json(token);
});
