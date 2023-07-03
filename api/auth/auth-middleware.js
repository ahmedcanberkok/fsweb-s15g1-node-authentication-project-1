/*
  Kullanıcının sunucuda kayıtlı bir oturumu yoksa

  status: 401
  {
    "message": "Geçemezsiniz!"
  }
*/

const model = require("../users/users-model");
const bcrypt= require("bcryptjs");
function sinirli(req,res,next) {
  try {
    if (req.session && req.session.user_id) { 
      next();
    } else {
      next ( {
        status: 401,
        message: "Geçemezsiniz!"
      });
    }
  } catch (error) {
    next(error);
  }

}

/*
  req.body de verilen username halihazırda veritabanında varsa

  status: 422
  {
    "message": "Username kullaniliyor"
  }
*/
async function usernameBostami() {
try {
  const userExist = await model.goreBul({username: req.body.username})
  if (userExist && userExist.length) {
    next({ 
      status: 422,
      message:"Username kullaniliyor",
    });
    
  } else {
    req.body.password = bcrypt.hashSync(req.body.password);
    next();
  }
} catch (error) {
  next(error);
}
}

/*
  req.body de verilen username veritabanında yoksa

  status: 401
  {
    "message": "Geçersiz kriter"
  }
*/
async function usernameVarmi(req,res,next) {
try {
  let {username} = req.body;
  const isExist = await model.goreBul({username: username});
  if (isExist&&isExist.length>0) {
    let user = isExist[0];
    let isPassworMatch = bcrypt.compareSync(
      re.body.password,
      user.password
    );
    if (isPassworMatch) {
      req.dbUser = user ;
      next();
    } else {
      res.status(401).json({message: "Geçersiz kriter"})
    }

  }

} catch (error) {
  next(error);
}

}

/*
  req.body de şifre yoksa veya 3 karakterden azsa

  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
*/
function sifreGecerlimi(req,res,next) {
try {
  let {password} = req.body;
  if (!password || password.length <3) {
    res.status(422).json({message: "Şifre 3 karakterden fazla olmalı"})
    
  } else {
    next();
  }
} catch (error) {
  next(error);
}
}
module.exports = {
  sifreGecerlimi,
  usernameVarmi,
  usernameBostami,
  sifreGecerlimi,
  sinirli
}
// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
