export const getTokenFromRequest = (req: Request): string | null => {
  const authorization = req.headers.get("authorization") ?? "";
  const [bearer, token] = authorization?.split(" ");

  if (bearer === "Bearer" && token) {
    return token;
  }

  return null;
};
