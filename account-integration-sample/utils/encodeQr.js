export const encodeQr = (payload) => {
  const data = JSON.stringify(payload);
  return encodeURIComponent(data);
}