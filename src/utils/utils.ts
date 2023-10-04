export const getEnvOrThrow = (name: string): string => {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is not set.`);
  }
  return value;
}

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
