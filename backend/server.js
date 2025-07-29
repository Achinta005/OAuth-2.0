const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
app.use(cookieParser());


dotenv.config();
app.use(cors({
  origin: [
    `${process.env.FRONTEND_URL}`,
    'https://o-auth-2-0-frontend.vercel.app'
  ],
  credentials: true
}));


app.get('/',(req,res)=>{
  res.send("hello")
})


//Grant access user to auto login into /dashboard if the jwt cookie data is correct
app.get('/auth_check',(req,res)=>{
  const token=req.cookies.token;
  if(!token){
    return res.json({isAuthenticated:false});
  }
  try {
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    res.json({isAuthenticated:true,user:decoded})
  } catch (error) {
    res.json({isAuthenticated:false})
  }
});


//Clear cookies to logout
app.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true, // true in production
    sameSite: 'none',
  });
  res.json({ success: true, message: 'Logged out' });
});


//Send user info to frontend(/dashboard)
app.get('/userInfo', (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'No token found' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    console.error('Error in /userInfo:', err.message);
    res.status(500).json({ error: 'Invalid token or internal error' });
  }
});





//redirect user to google's auth page
//After successfull login google redirect to predefined redirect url(can be change from google cloud console)
app.get("/auth/google", (req, res) => {
  const redirectUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${process.env.REDIRECT_URL}&` +
    `response_type=code&` +
    `scope=email profile&` +
    `access_type=offline`;

  res.redirect(redirectUrl);
});//           |
//redirect      |
//To            |        
//This          |
//Api           |
//Endpoint      V
app.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;

  try {
    // Exchange code for access token
    const data = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.REDIRECT_URL,
      },
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const accessToken = data.data.access_token;

    // Get User Info Using access token
    const userInfo = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // Create JWT token using userInfo data
    const token = jwt.sign(userInfo.data, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });

    // Set HTTP-only cookie that can be accessed by server only--And then send to users browser valid for 1day
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // set to true if using HTTPS
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });


    // Redirect to dashboard
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('OAuth failed');
  }
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
