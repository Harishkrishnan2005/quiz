export const getApiErrorMessage = (error, fallbackMessage) => {
  const responseData = error?.response?.data;
  const validationMessage = responseData?.details?.[0]?.msg;

  return validationMessage || responseData?.message || fallbackMessage;
};
