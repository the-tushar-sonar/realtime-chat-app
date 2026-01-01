import { verifyToken } from "../utils/jwt.js";

export default function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.sendStatus(401);

  try {
    const token = header.split(" ")[1];
    req.user = verifyToken(token);
    next();
  } catch {
    res.sendStatus(403);
  }
}
