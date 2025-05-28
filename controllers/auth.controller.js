import User from "../models/user.model.js";
import { errorHandler } from "../util/errorHandler.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// function to check password validation
function checkPassword(str) {
  var re =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!\"#$%&'()*+,\-.\/:;<=>?@$$ \\ $$^_`{|}~]).{8,}$/;
  return re.test(str);
}

// generate jwt token

function generateJWT(user) {
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET_STRING,
    {
      expiresIn: "1d",
    }
  );
  return token;
}

// 1: signup
export const signup = async (req, res, next) => {
  try {
    const { userName, fullName, email, password, confirmPassword } = req.body;
    if (!userName || !fullName || !email || !password || !confirmPassword) {
      next(errorHandler(400, "All fields are required."));
    }
    // password validation
    if (!checkPassword(password)) {
      return next(
        errorHandler(
          400,
          "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character."
        )
      );
    }
    if (password !== confirmPassword) {
      return next(errorHandler(404, "Passwords should be same."));
    }

    // check if user already exits
    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });
    if (existingUser) {
      return next(
        errorHandler(400, "User already exits with this email or user name.")
      );
    }
    // hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = await User.create({
      userName,
      fullName,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "User created successfully.",
      user: newUser,
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
};

// 2: signin

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
      return next(errorHandler(400, "All fields are required"));
    }

    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(400, "User not found"));

    // check for password
    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) {
      return next(errorHandler(400, "Invalid password"));
    }
    // user is validated
    user.password = undefined;
    const token = generateJWT(user);
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 5,
      })
      .json(user);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
