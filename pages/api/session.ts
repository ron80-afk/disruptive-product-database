import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // example: userId stored in cookie/session
  const userId = req.cookies.userId;

  if (!userId) {
    return res.status(200).json({ userId: null });
  }

  return res.status(200).json({ userId });
}
