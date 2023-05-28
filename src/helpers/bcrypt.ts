import bc from 'bcryptjs';

export const bcHash = async (password: string) => {
  const salt = await bc.genSalt(10);

  return await bc.hash(password, salt);
};

export const bcCompare = async (passwordOne: string, passwordTwo: string) => await bc.compare(passwordOne, passwordTwo);
