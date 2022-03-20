import { catchAsync } from "../../utils/catchAsync";
import { GetTransactionById } from "../../services/of-transactions";

export const CheckOutUI = catchAsync(async (req, res) => {
  const id = req.query.id;
  if (!id) {
    throw new Error("Missing `id` in query");
  }
  const transInfo = await GetTransactionById({
    transaction_id: id,
  });
  res.render("orchestrated/index", {
    account_reference_id: transInfo?.account_reference_id,
    id,
  });
});
