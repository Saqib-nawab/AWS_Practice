export const handler = async (event) => {
  // TODO implement
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: 'Hello from Lambda!, My first Function' }),
  };
  return response;
};
