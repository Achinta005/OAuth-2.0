```
Frontend (localhost:3001)
↓
User clicks “Login with Google”
↓
Redirect to → http://localhost:3000/auth/google
↓
Google Auth Page → User logs in
↓
Google redirects to:
http://localhost:3000/auth/google/callback?code=abc123
↓
Backend exchanges code for access token and gets user info
↓
Sends JSON with user data (or redirects to frontend)
```