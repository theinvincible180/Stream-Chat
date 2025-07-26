import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { upsertStreamUser } from "../lib/stream.js";

export async function signup(req, res) {
  let { fullName, email, password} = req.body;
  email = email?.toLowerCase();

  try {

    if(!fullName || !email || !password){
        return res.status(400).json({message : "All fields are necessary to signup"});
    }

    if(password.length < 8){
        return res.status(400).json({message : "Password must be at least 8 characters long"});
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({email});

    if(existingUser){
        return res.status(400).json({ message: "User already exists!!!"});
    }

    //const hashedPassword = await bcrypt.hash(password, 10);

    const idx = Math.random().toString(36).substring(7); // random string
    const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${idx}`;

    const newUser = await User.create({
        fullName,
        email,
        password,
        profilePic : randomAvatar,
    })

    // To-do : Create the user in stream as well

    try {
      await upsertStreamUser({
      id : newUser._id.toString(),
      name : newUser.fullName,
      image : newUser.profilePic || "",
    })
    console.log(`Stream User Created for ${newUser.fullName}`);
    } catch (error) {
      console.log("Error creating Stream User", error);
    }

    const token = jwt.sign({userId : newUser._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: "30d"
    })

    res.cookie("jwt", token, {
        maxAge : 30 * 24 * 60 * 60 * 1000,
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie, XSS protection
        samesite: "strict", // Helps prevent CSRF attacks
        secure : process.env.NODE_ENV === "production" // Ensures the cookie is sent over HTTPS in production
    })

    res.status(201).json({
        success: true,
        user : newUser
    })

  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({message : "Internal Server Error"});
  }
}

export async function login(req, res) {
  try {
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(400).json({messge : "All fields are necessary!"});
    }

    const user = await User.findOne({email});
    if(!user){
      return res.status(401).json({message : "Invalid email or password!"});
    }

    const isPasswordCorrct = await user.matchPassword(password);
    if(!isPasswordCorrct){
      return res.status(401).json({message : "Invalid email or password!"});
    }

    const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: "30d"
    })

    res.cookie("jwt", token, {
        maxAge : 30 * 24 * 60 * 60 * 1000,
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie, XSS protection
        samesite: "strict", // Helps prevent CSRF attacks
        secure : process.env.NODE_ENV === "production" // Ensures the cookie is sent over HTTPS in production
    })

    res.status(200).json({
        success: true,
        user
    })
  } 
  
  catch (error) {
    console.log("Error in login controller:", error);
    res.status(500).json({message : "Internal Server Error"});
  }
}   

export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({success : true, message: "Logged out successfully!"});
  // Optionally, you can also redirect the user to a login page or home page
  //res.redirect('/login');
}

export async function onboard(req, res) {

  try {
    const userId = req.user._id;
    const {fullName, bio, location} = req.body;

    if(!fullName || !bio || !location){
      return res.status(400).json({
        message : "All fields are necessary to complete onboarding",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !location && "location"
        ].filter(Boolean),
      })
    }

    const updatedUser = await User.findByIdAndUpdate(userId,{
      ...req.body,
      isOnboarded: true,
    }, {new : true})

    if(!updatedUser){
      res.status(404).json({message : "User not found!"});
    }

    try {
      await upsertStreamUser({
      id : updatedUser._id.toString(),
      name : updatedUser.fullName,
      image : updatedUser.profilePic || "",
    })

    console.log(`Stream User Updated for ${updatedUser.fullName}`);
    } catch (streamError) {
      console.log("Error updating Stream User", streamError.message);    
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    console.log("Error in onboarding controller:", error);
    res.status(500).json({message : "Internal Server Error"});
  }
}