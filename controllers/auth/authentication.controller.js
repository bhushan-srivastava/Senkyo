import bcrypt from "bcrypt";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import { Canvas, Image, ImageData, loadImage } from "canvas";
import * as faceapi from "face-api.js";
import Users from "../../models/user/user.model.js";
import Admins from "../../models/admin/admin.model.js";
import saveBase64ToJpg from "./file handlers/createJpg.js";
import deleteFolder from "./file handlers/deleteJpg.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename2 = fileURLToPath(import.meta.url);
const __dirname2 = path.dirname(__filename2);

const threeDays = 3 * 24 * 60 * 60 * 1000;

function createToken({ userId, email, role, name }) {
  return jwt.sign(
    {
      sub: String(userId),
      email,
      role,
      name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: threeDays / 1000 }
  );
}

async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;
    const admin = await Admins.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Incorrect email" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required to login" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = createToken({
      userId: admin._id,
      email: admin.email,
      role: "admin",
      name: admin.name,
    });
    return res.status(200).json({
      message: "Login successful",
      token,
      role: "admin",
      user: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Login unsuccessful" });
  }
}

async function recognizeFaces(imagePath1, imagePath2) {
  const faceAPIModelsPath = path.join(__dirname2, "./face-api-models");

  await faceapi.nets.faceRecognitionNet.loadFromDisk(faceAPIModelsPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(faceAPIModelsPath);
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(faceAPIModelsPath);

  const img1 = await loadImage(imagePath1);
  const img2 = await loadImage(imagePath2);

  const detections1 = await faceapi.detectAllFaces(img1).withFaceLandmarks().withFaceDescriptors();
  const detections2 = await faceapi.detectAllFaces(img2).withFaceLandmarks().withFaceDescriptors();

  if (!detections1.length || !detections2.length) {
    deleteFolder("./photos");
    throw new Error("Please take a clear picture");
  }

  const faceMatcher = new faceapi.FaceMatcher(detections1);
  const results = detections2.map((descriptor) => faceMatcher.findBestMatch(descriptor.descriptor));

  deleteFolder("./photos");
  return results;
}

async function userLogin(req, res) {
  const { email, password, imgCode } = req.body;

  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }
    if (!user.verified) {
      return res
        .status(401)
        .json({ message: "Please wait for an Admin to verify your account. Try logging in after few days" });
    }
    if (!password || !imgCode) {
      return res.status(400).json({ message: "Email, password and image are required" });
    }

    const isQrLogin =
      password.startsWith(process.env.SECRET || "") &&
      password === user.password;
    const isPasswordLogin = await bcrypt.compare(password, user.password);

    if (!isQrLogin && !isPasswordLogin) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

    await saveBase64ToJpg(user.imgCode, imgCode);
    const results = await recognizeFaces("./photos/ref.jpg", "./photos/test.jpg");
    const distance = results?.[0]?._distance;

    if (typeof distance !== "number") {
      return res.status(422).json({ message: "Cannot process your request" });
    }
    if (distance > 0.6) {
      return res.status(422).json({ message: "Cannot process your request" });
    }

    const token = createToken({
      userId: user._id,
      email: user.email,
      role: "voter",
      name: user.name,
    });
    return res.status(200).json({
      message: "Login was successful",
      token,
      role: "voter",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: "voter",
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Login unsuccessful" });
  }
}

async function userRegister(req, res) {
  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);
    const password = await bcrypt.hash(req.body.password, saltRounds);

    await Users.create({
      name: req.body.name,
      email: req.body.email,
      password,
      course: req.body.course,
      division: req.body.division,
      gender: req.body.gender,
      imgCode: req.body.imgCode,
      verified: false,
    });

    const qrData = { email: req.body.email, password };
    const url = await QRCode.toDataURL(JSON.stringify(qrData));

    return res.status(201).json({
      success: true,
      url,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Registration unsuccessful" });
  }
}

async function logout(req, res) {
  try {
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: "Logout unsuccessful" });
  }
}

export { userLogin, userRegister, adminLogin, logout };
