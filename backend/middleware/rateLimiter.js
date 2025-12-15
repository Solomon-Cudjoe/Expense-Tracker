import ratelimit from "../config/upstash.js";

const ratelimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("global");

    if (!success) {
      return res
        .status(429)
        .json({ message: "Too many requests, please try aagin later." });
    }
    next();
  } catch (error) {
    console.log("Rate limiter error:", error);
    next(error);
  }
};

export default ratelimiter;
