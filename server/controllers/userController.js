import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"
import genrateToken from "../utils/genrateToken.js"

/* ===================================================== Authenticate User ======================================================================= */

// @desc    Auth user/set Token
// route    POST /api/user/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    genrateToken(res, user._id)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    })
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password")
  }

})

/* ===================================================== Register User ======================================================================= */

// @desc    Register a new user
// route    POST /api/user
// @access  Public
const registerUser = asyncHandler(async (req, res) => {

  const { name, email, password } = req.body
  const userExists = await User.findOne({ email: email })

  if (userExists) {
    res.status(400)
    throw new Error("User Already Exists")
  }

  const user = await User.create({
    name, email, password
  })

  if (user) {
    genrateToken(res, user._id)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    })
  } else {
    res.status(400);
    throw new Error("Invalid user Data")
  }
})

/* ===================================================== LogOut User ======================================================================= */

// @desc    logout a new user
// route    POST /api/user/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0)
  })
  res.status(200).json({ message: "User Logged Out" })
})

/* ===================================================== Get Users Profile ======================================================================= */

// @desc    Get user Profile
// route    GET /api/user/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email
  }
  res.status(200).json(user)
})

/* ===================================================== Update Users Profile ======================================================================= */

// @desc    Update user Profile
// route    Put /api/user/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    })

  } else {
    res.status(404);
    throw new Error("User not found")
  }
})


export { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile }