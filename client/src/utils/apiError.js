export default function apiErrorMessage(error, fallback) {
  const apiMessage = error?.response?.data?.error?.message;
  if (apiMessage) {
    return apiMessage;
  }

  return fallback;
}

