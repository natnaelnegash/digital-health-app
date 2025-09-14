
const verifyToken = (token: any) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
};

module.exports = { verifyToken };
