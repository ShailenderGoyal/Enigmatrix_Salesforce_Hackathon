import User from "../models/users.model.js"
import bcrypt from "bcrypt"
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export async function handleRegisterUser(req, res) {
    try {
      const {name,email,password} = req.body;
      
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user object
      const newUser = {
        name,
        email,
        passwordHash: hashedPassword,
      };
  
      // Save the new user to the database
      await new User(newUser).save();

  
      res.status(201).json({ message: 'User registered successfully',success:true });
  
    } 
    catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

export async function handleLoginUser(req, res) {
    try {
      const { email, password} = req.body;

      // Find the user by email
      const user = await User.findOne({ email});
      
      if (!user) {
        return res.status(403).json({ message: 'Invalid credentials' });
      }
  
      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, user.passwordHash);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Create a JWT token
      const token = jwt.sign(
        { email: user.email, _id: user._id,profilePhoto:user.profilePhoto },
        process.env.JWT_SECRET,  
        { expiresIn: '5h' }
      );
  
      // Respond with the token and user role
      return res.status(200).json({
        message: 'Login successful',
        token,
        email: user.email,
        name: user.name,
        success:true
      });
  
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
  
  
  
 export const googleAuthCallback = async (req, res) => {
  try {
    console.log("Starting Google Auth Callback");
    const { token } = req.query;
    // console.log("Token received:", token);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    // console.log("Google token verified");

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    // console.log("Payload ", payload);
    
    // console.log("Payload extracted:", { email, name});

    let user = await User.findOne({ email });
    // console.log("User found:", user);

    if (!user) {
      // console.log("User not found, creating new user");
      const hashedPassword = await bcrypt.hash("Google Login", 10);
      user = await User.create({ name, email, passwordHash: hashedPassword,profilePhoto:picture });
      console.log("User created:", user);
    }

    const jwt_token = jwt.sign(
      { email: user.email, _id: user._id ,profilePhoto:user.profilePhoto},
      process.env.JWT_SECRET,
      { expiresIn: '5h' }
    );
    // console.log("JWT token generated");

    return res.status(200).json({
      message: 'Login successful',
      token: jwt_token,
      email: user.email,
      name: user.name,
      profilePhoto:user.profilePhoto,
      success: true
    });
  } catch (error) {
    console.error("Google authentication failed:", error);
    res.status(500).json({ message: "Authentication failed", error });
  }
};

