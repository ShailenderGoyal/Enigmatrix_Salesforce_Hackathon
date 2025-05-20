import jwt from "jsonwebtoken"
export const ensureAuthenticated = async (req, res, next) => {
    const authorization = req.headers.authorization;
    const token = authorization && authorization.startsWith('Bearer ')? authorization.split(' ')[1]: authorization; // Fallback to the full value if no 'Bearer'
    
    // const token = req.headers.authorization?.split(' ')[1]  ;
    // console.log("request received");
    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user =decoded;
    //   console.log("token verified");
      next();
    } catch (error) {
    
      res.status(401).json([{ message: `Failed to authenticate token: ${error.message}` },{error:`${error}`}]);
    }
  };