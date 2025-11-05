# Backend Google Authentication Implementation Guide

## Overview
The frontend sends a Google credential (JWT token) to your backend. Your backend validates it with Google and returns your own authentication tokens.

## Endpoint Required

### POST `/api/v1/auth/google`

**Request Body:**
```json
{
  "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM..."  // Google JWT token
}
```

**Your Backend Should:**

1. **Validate the Google Token**
   - Verify the token signature with Google's public keys
   - Check token expiration
   - Verify the audience matches your Client ID

2. **Extract User Information**
   ```javascript
   // Decoded token contains:
   {
     "iss": "https://accounts.google.com",
     "sub": "1234567890",  // Google user ID
     "email": "user@example.com",
     "email_verified": true,
     "name": "John Doe",
     "picture": "https://...",
     "given_name": "John",
     "family_name": "Doe",
     "iat": 1516239022,
     "exp": 1516242622
   }
   ```

3. **Create or Update User in Your Database**
   - Check if user exists by Google ID or email
   - Create new user if doesn't exist
   - Update user info if exists

4. **Generate Your Own Tokens**
   - Create access token (JWT, short-lived: 15min - 1hour)
   - Create refresh token (long-lived: 7-30 days)
   - Store refresh token in database

5. **Return Response**

**Response (200 OK):**
```json
{
  "accessToken": "your-jwt-access-token",
  "refreshToken": "your-jwt-refresh-token",
  "user": {
    "id": "user-id-in-your-db",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://...",
    "role": "user"
  }
}
```

## Implementation Examples

### Node.js (Express + google-auth-library)

```javascript
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/api/v1/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;

    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;

    // Find or create user in database
    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
        picture,
        role: 'user'
      });
    }

    // Generate your own JWT tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token
    await RefreshToken.create({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
```

### Python (FastAPI + google-auth)

```python
from google.oauth2 import id_token
from google.auth.transport import requests

@app.post("/api/v1/auth/google")
async def google_auth(credential: str):
    try:
        # Verify token
        idinfo = id_token.verify_oauth2_token(
            credential,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        google_id = idinfo['sub']
        email = idinfo['email']
        name = idinfo['name']
        picture = idinfo['picture']

        # Find or create user
        user = db.query(User).filter(User.google_id == google_id).first()
        if not user:
            user = User(
                google_id=google_id,
                email=email,
                name=name,
                picture=picture
            )
            db.add(user)
            db.commit()

        # Generate tokens
        access_token = create_access_token(user)
        refresh_token = create_refresh_token(user)

        return {
            "accessToken": access_token,
            "refreshToken": refresh_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "picture": user.picture,
                "role": user.role
            }
        }
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

## Additional Endpoints Needed

### GET `/api/v1/auth/me`
Verify current access token and return user info

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://...",
  "role": "user"
}
```

### POST `/api/v1/auth/refresh`
Exchange refresh token for new access token

**Request:**
```json
{
  "refreshToken": "your-refresh-token"
}
```

**Response:**
```json
{
  "accessToken": "new-access-token"
}
```

## Security Best Practices

1. **Always verify the Google token** - Never trust client-provided data
2. **Use HTTPS** - Protect tokens in transit
3. **Short-lived access tokens** - 15 minutes to 1 hour
4. **Rotate refresh tokens** - Issue new refresh token on each refresh
5. **Store refresh tokens securely** - Hash them in database
6. **Rate limiting** - Prevent brute force attacks
7. **Audit logging** - Log all authentication attempts

## Environment Variables Needed

```env
GOOGLE_CLIENT_ID=your-google-client-id
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
```

## Testing

You can test with cURL:

```bash
curl -X POST http://localhost:3000/api/v1/auth/google \
  -H "Content-Type: application/json" \
  -d '{"credential":"eyJhbGciOiJSUzI1NiIsImtpZCI6IjM..."}'
```

## Frontend Integration (Already Done ✅)

The frontend is already configured to:
1. Show Google One-Tap prompt
2. Send credential to `/api/v1/auth/google`
3. Store access token, refresh token, and user data
4. Automatically refresh tokens when expired
5. Handle authentication errors
