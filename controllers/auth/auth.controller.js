import { genSalt, hash } from 'bcrypt';
import User from '../../models/user/user.model.js';




let user_login = async (req, res) => {


}



let user_register = async (req, res) => {

  console.log('\nuser entered data:', req.body)

  genSalt(10, (err, salt) => {
    if (err) {
      throw new Error('Encountered error while adding salt');
    }
    hash(req.body.password, salt, (err, hashPassword) => {
      if (err) {
        throw new Error('Encountered error while hashing your password');
      }
      console.log('Hashed password: ', hashPassword);
      runQuery(hashPassword);

    })
  })

  function runQuery(password) {
    let user = {
      name: req.body.name,
      email: req.body.email,
      password,
      course: req.body.course,
      division: req.body.division,
      imgCode: req.body.imgCode
    }
    console.log('payload user data', user);

    let data = User(user)
      .then(() => res.json({ success: true }))
      .catch((err) => console.log("\nerror from register request:\n ", err));
  }


}



export { user_login, user_register }