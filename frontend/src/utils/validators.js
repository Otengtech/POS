export const isValidGhanaPhone = (phone) => {
  const regex = /^(0|233)[2-9][0-9]{8}$/;
  return regex.test(phone);
};

export const isValidEmail = (email) => {
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(email);
};

export const isValidDigitalAddress = (address) => {
  const regex = /^[A-Z]{2}-\d{3}-\d{4}$/;
  return regex.test(address);
};