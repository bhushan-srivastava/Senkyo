import bcrypt from "bcrypt";
import QRCode from "qrcode";
import jwt from 'jsonwebtoken';
import { Canvas, Image, ImageData, loadImage } from 'canvas';
import * as faceapi from 'face-api.js';
import Users from "../../models/user/user.model.js"
import Admins from "../../models/admin/admin.model.js"
import saveBase64ToJpg from './file handlers/createJpg.js';
import deleteFolder from "./file handlers/deleteJpg.js";


import path from 'path'
import { fileURLToPath } from 'url';

const __filename2 = fileURLToPath(import.meta.url);

const __dirname2 = path.dirname(__filename2);

async function adminLogin(req, res) {
  try {
    const admin = await Admins.findOne({ "email": req.body.email });

    if (!admin) {
      throw new Error('Incorrect email')
    }

    if (!req.body.password) {
      throw new Error('Password is required to login')
    }

    const auth = await bcrypt.compare(req.body.password, admin.password);
    if (!auth) {
      throw new Error('Incorect password')

    }

    const token = createToken(admin.email);
    // for production if website is deployed on https server
    /* production environment */
    if (process.env.NODE_ENV === 'production') {
      res.cookie('vote', token, { httpOnly: true, secure: true, maxAge: threeDays });
    }
    else {
      res.cookie('vote', token, { httpOnly: true, maxAge: threeDays });
    }

    res.cookie('name', admin.name, { maxAge: threeDays });
    res.status(200).json({ message: 'Login successful', name: admin.name });
  }
  catch (error) {
    res.status(401).json({ message: error.message })
  }
}

// create json web token
const threeDays = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
function createToken(email) {
  return jwt.sign(
    { email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: (threeDays / 1000) }
  );
};

async function recognizeFaces(imagePath1, imagePath2) {

  // Load face detection and recognition models
  // await faceapi.nets.faceRecognitionNet.loadFromDisk("./face-api-models");
  // await faceapi.nets.faceLandmark68Net.loadFromDisk("./face-api-models");
  // await faceapi.nets.ssdMobilenetv1.loadFromDisk("./face-api-models");

  const faceAPIModelsPath = path.join(__dirname2, './face-api-models');


  // Load face detection and recognition models
  await faceapi.nets.faceRecognitionNet.loadFromDisk(faceAPIModelsPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(faceAPIModelsPath);
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(faceAPIModelsPath);


  // Load images
  const img1 = await loadImage(imagePath1);
  const img2 = await loadImage(imagePath2);

  //console.log(img1);
  //console.log(img2);

  // Detect faces in images
  const detections1 = await faceapi.detectAllFaces(img1).withFaceLandmarks().withFaceDescriptors();
  const detections2 = await faceapi.detectAllFaces(img2).withFaceLandmarks().withFaceDescriptors();

  console.log("D1:", detections1);
  console.log("~~d2:", detections2);

  if (detections2.length == 0) {
    const folderPath = './photos';
    deleteFolder(folderPath);

    throw new Error('Please take a clear picture');
  }

  // Recognize faces
  const faceMatcher = new faceapi.FaceMatcher(detections1);
  const results = detections2.map(descriptor =>
    faceMatcher.findBestMatch(descriptor.descriptor)
  );

  const folderPath = './photos';
  deleteFolder(folderPath);
  return results;

}

let userLogin = async (req, res) => {
  const { email, password, imgCode } = req.body;

  try {
    const user = await Users.findOne({ "email": email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }
    if (user && !user.verified) {
      return res.status(401).json({ message: 'Please wait for an Admin to verify your account. Try logging in after few days' })
    }

    if (
      (password.startsWith(process.env.SECRET) && password == user.password)
      ||
      (await bcrypt.compare(password, user.password))
    ) {

      // Set up canvas for face-api.js
      faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

      let base64Img1 = user.imgCode;
      let base64Img2 = imgCode;

      //creating jpg files from base64 strings
      await saveBase64ToJpg(base64Img1, base64Img2);

      //face recognition
      const imagePath1 = './photos/ref.jpg';
      const imagePath2 = './photos/test.jpg';
      const results = await recognizeFaces(imagePath1, imagePath2);
      const distance = results[0]._distance;
      console.log('Results:', results[0]._distance);

      if (distance <= 0.6) {
        const accessToken = createToken(user.email);

        // for production if website is deployed on https server
        /* production environment */
        if (process.env.NODE_ENV === 'production') {
          res.cookie('vote', accessToken, { httpOnly: true, secure: true, maxAge: threeDays });
        }
        /* local environment */
        else {
          res.cookie('vote', accessToken, { httpOnly: true, maxAge: threeDays });
        }

        res.cookie('name', user.name, { httpOnly: false, maxAge: threeDays });

        res.statusCode = 200;

        res.end(JSON.stringify({ message: 'login was successful' }));

      } else {
        res.statusCode = 422;
        res.end(JSON.stringify({ message: 'Cannot process your request' }));
      }

    }

  } catch (error) {
    console.log("error while voter login", error);
    res.status(400).json({ message: error.message });
  }

}

let userRegister = async (req, res) => {


  bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS), (err, salt) => {
    if (err) {
      throw new Error("Encountered error while adding salt", err.message);
    }
    bcrypt.hash(req.body.password, salt, (err, hashPassword) => {
      if (err) {
        throw new Error("Encountered error while hashing your password");
      }
      runQuery(hashPassword);
    });
  });

  function runQuery(password) {
    let user = {
      name: req.body.name,
      email: req.body.email,
      password,
      course: req.body.course,
      division: req.body.division,
      gender: req.body.gender,
      imgCode: req.body.imgCode,
      verified: false,
    };

    let qrData = {
      email: req.body.email,
      password,
    };


    let data = Users
      .create(user)
      .then(() => {
        QRCode.toDataURL(JSON.stringify(qrData), function (err, url) {
          if (err) console.log("Error creating QR code", err);

          res.json({
            success: true,
            url: url,
          });
        });
      })
      .catch((err) => console.log("\nerror from register request:\n ", err));
  }
};

async function logout(req, res, next) {
  try {
    res.clearCookie('vote'); // works
    res.clearCookie('name');
    // res.clearCookie('isAdmin'); // ?? not a cookie
    res.status(200).json({ message: 'Logout successful' })

  }
  catch (error) {
    res.status(500).json({ message: 'Logout unsuccessful' })
  }
}

export { userLogin, userRegister, adminLogin, logout };
