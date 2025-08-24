const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const jwksClient = require('jwks-rsa');
const User = require('../Models/User'); 
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const bcrypt = require('bcrypt');

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
exports.googleAuth = async (req, res) => {
  const { id_token } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ googleId: sub });

    if (!user) {
      user = await User.create({
        googleId: sub,
        email,
        name,
        avatar: picture,
        provider: 'google',
      });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user });
  } catch (err) {
    console.error('Google Auth Error:', err.message);
    res.status(401).json({ error: 'Invalid Google token' });
  }
};


exports.createAccount = async(req,res)=>{
    try {
        const {name , email , password} = req.body;
        const hashedPassword = await bcrypt.hash(password , 10);
        const newUser = await User.create({
            name,
            email,
            password:hashedPassword
            
        })
        const token = jwt.sign({user:newUser}, JWT_SECRET , {expiresIn:'7d'})
        return res.status(200).json({user:newUser , token})
        
    } catch (error) {
        return res.status(404).json({error:error.message});
        
    }
}

exports.login = async(req,res)=>{
    try {
      console.log('hit');
        const {email , password} = req.body;
        const foundUser = await User.findOne({email});
        
        if(!foundUser){
            return res.status(401).json({error:"No User Found"})
        }
        const userPassword = foundUser.password;
        console.log(userPassword);

        if(await bcrypt.compare(password, userPassword)){
            const token = jwt.sign({user:foundUser} , JWT_SECRET , {expiresIn:'7d'})
            return res.status(200).json({user:foundUser , token})

        }else{
            return res.status(404).json({message:'Access Denied '})
        }

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:error.message});
        
    }
}