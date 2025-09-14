// api/src/utils/sendTokenResponse.ts
export const sendTokenResponse = (user: { id: any; email: any; }, statusCode: number, res: { status: (arg0: number) => { json: (arg0: { success: boolean; token: string; user: { id: any; email: any; }; }) => void; }; }) => {
  // For now, send a dummy token
  const token = "dummy-token";

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user?.id || "dummy-id",
      email: user?.email || "dummy@example.com",
    },
  });
};