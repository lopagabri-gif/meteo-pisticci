// api/send-notification.js
const crypto = require("crypto");

const PROJECT_ID = "meteo-pisticci";
const CLIENT_EMAIL = "firebase-adminsdk-fbsvc@meteo-pisticci.iam.gserviceaccount.com";
const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCqUp0lrNDqpP1O\nRHpZoknJm42eo3yvQs6ecWTLvojkuU6HAxKLAeOy0A4iP6AqJubUF4I90CqloY4q\nhzYKptR1l50RFeU0GH8WFWyqIipR8KuzT4zineIip7OPt/NVoVCDLXcdMT0++V9h\nrXXdcge+5k5/JpJAaV3RGn1huPBf2Oh/j2mnpokcg5F3CANurzU/0ivMJXrRHqxr\nI38DI1WcOVZmE3dg9qhggYyC/BAZ5ocGuYR6CKY6XD2Ya5XNy3LQfK5Sx7miyVf0\ntbub89UJIoVNYy8I010uQIhn+dDkrCcfP7RUfiD4TSubUGLX/JZMMLjo2jggumLV\nvwso1F+FAgMBAAECggEADMGwRGybnx9pW23UjhcSGLf+VOXgxk2mJQbQKlRkc2EP\nqRwJTQEAuVlM3bLPP6j3O+Zg2llXgF1HxRaobQbOvdnzqR5vMsYs6o4DPADgE5AH\nhCAOqMBzee3+jGKWJpE08wY6OCUCdc9+ndW8kK/kNZ+RPIO6i3l4zdsCjgmocz0v\n2Cir6unoKgssXnFbOGYsiEZf2M2B9Is9yAGvDs5p67QoLLbxyPG8hHuoID+Sa990\n0+yX7kv4LbfmwGSKRsYitAtqxlPbGTLGfwc4PUIs+k2VlPJJPOgow9CYDstE465Y\nfMtU2FQz7uJ7M4hN7pVsqaWyLs91s3qzTp3NZgwxpwKBgQDiALQT8/vaw77bNVAD\ncvvuoW5T3JUXJ5C8/tqp12pe61AkpZI4RsOZIyQtdzEXUXAg9R9ot19yNtlsTcGz\nbvu6AUtRa37NeqkWxVluNB98lwpEKDc7blVa1wyMEeeMRVVOO5OXOMRUL8Uj0KvJ\nkj34bv7tBPyiTgbBsVh0zi0KdwKBgQDA7fiQNvLVJvgqtiRKQ4xspFcp4yH9sp56\nMWdq/CIRrMK18a4mxzHPUCGYu9sa0RMIt/PfrykPoE8iUwTpNlgbXy9Wmyid3sBV\nHkTK9+/EMqVJOj+8DIiCYZAmMiwMgcFj0knLm9CGjYXp6AgceQUXK+clcFy2CBY9\nEUEdE6qo4wKBgQCJc+oSFJsB83l5sxQF9QH6oZ4LTSY0HfEusUXmdEiSkEV+9GBY\n79j4o2HWcR6fUv2CXfMLajOXsHpOH4CGlCJvf2gCjgFiEY8TdVWt6++Wg/pPd7IX\n6EPras2LxzvvmR+H5D4gg/sMRL1+yeQhRVuBZGiRWS4ZvKDpXuYwrFDCgwKBgB9+\nORcBgT4+MEB4nw/oWuHZKclSpFfPcoMr0V/rbHxKITamDvGRjpXy1Kkj8S49dsfz\nj0GyTBea6ZAG0URodJVzQjz28vhiRi8e08f2FROH2OdNNN4zhY0S8/7oLbyU6car\nqxQriSyNqZB3KevL7YLMzdyUrO2iAE9To7dlYHRVAoGBALsNX+SPQ+Z0RpBl3uGd\nU2Ii313F3qjIesaSuoNg5d+LTYYCipUypBKf0cgRR9c5w3DIOARG2x2/xvkCnIWb\nwmyQyyr/eSUEa8pNRoCsXQchigTs+zJu9oqVy7joSED2qTY2kY3BLd1nOYaNEs5e\nxHeqRjjJbRWsw+HSpEZJtTRY\n-----END PRIVATE KEY-----\n";
const ADMIN_PASSWORD = "meteopisticci2026";

function getJWT() {
  const now = Math.floor(Date.now() / 1000);
  const header  = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    iss:   CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud:   "https://oauth2.googleapis.com/token",
    exp:   now + 3600,
    iat:   now,
  })).toString("base64url");

  const sigInput = header + "." + payload;
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(sigInput);
  const signature = sign.sign(PRIVATE_KEY, "base64url");
  return sigInput + "." + signature;
}

async function getAccessToken() {
  const jwt = getJWT();
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=" + jwt,
  });
  const data = await res.json();
  if (!data.access_token) throw new Error("Token fallito: " + JSON.stringify(data));
  return data.access_token;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { tokens, title, body, url, password } = req.body;

  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: "Non autorizzato" });
  if (!tokens || !tokens.length || !title || !body) return res.status(400).json({ error: "Parametri mancanti" });

  try {
    const accessToken = await getAccessToken();
    const FCM_URL = "https://fcm.googleapis.com/v1/projects/" + PROJECT_ID + "/messages:send";

    let success = 0;
    let failed  = 0;

    for (const token of tokens) {
      try {
        const r = await fetch(FCM_URL, {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: {
              token,
              notification: { title, body },
              webpush: {
                notification: {
                  title, body,
                  icon: "/5f6a1571-8449-4f65-afcd-8130873109bb.png",
                  badge: "/5f6a1571-8449-4f65-afcd-8130873109bb.png",
                },
                fcm_options: { link: url || "https://meteo-pisticci.vercel.app" },
              },
            },
          }),
        });
        if (r.ok) success++;
        else { failed++; const t = await r.text(); console.error("FCM:", t); }
      } catch (e) { failed++; }
    }

    return res.status(200).json({ success, failed, total: tokens.length });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
