const REGION = import.meta.env.VITE_COGNITO_REGION || "eu-west-2";
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const KEY = "procuratio.session";

const MESSAGES = {
  NotAuthorizedException: "The email or password is incorrect.",
  UserNotFoundException: "The email or password is incorrect.",
  UserNotConfirmedException: "This account has not been confirmed yet.",
  PasswordResetRequiredException: "This account needs a password reset before it can sign in.",
  TooManyRequestsException: "Too many attempts. Wait a moment and try again.",
  LimitExceededException: "Too many attempts. Wait a moment and try again.",
};

async function cognito(target, body) {
  if (!CLIENT_ID) {
    throw new Error("VITE_COGNITO_CLIENT_ID is not set. Add it to .env and restart the dev server.");
  }
  const res = await fetch(`https://cognito-idp.${REGION}.amazonaws.com/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": `AWSCognitoIdentityProviderService.${target}`,
    },
    body: JSON.stringify({ ClientId: CLIENT_ID, ...body }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(MESSAGES[data.__type] || data.message || "Sign-in failed. Try again.");
  }
  return data;
}

// Tokens live in sessionStorage, so closing the tab signs you out.
const read = () => {
  try { return JSON.parse(sessionStorage.getItem(KEY)); } catch { return null; }
};
const write = (session) => sessionStorage.setItem(KEY, JSON.stringify(session));

export const hasSession = () => Boolean(read());
export const signOut = () => sessionStorage.removeItem(KEY);

export async function signIn(email, password) {
  const data = await cognito("InitiateAuth", {
    AuthFlow: "USER_PASSWORD_AUTH",
    AuthParameters: { USERNAME: email.trim(), PASSWORD: password },
  });
  const result = data.AuthenticationResult;
  if (!result) {
    throw new Error(
      data.ChallengeName === "NEW_PASSWORD_REQUIRED"
        ? "This account still has a temporary password. Set a permanent one first."
        : "This account needs an extra sign-in step that the app does not support yet."
    );
  }
  write({
    idToken: result.IdToken,
    refreshToken: result.RefreshToken,
    expiresAt: Date.now() + result.ExpiresIn * 1000,
  });
}

// Returns a valid ID token, refreshing it quietly when it is about to expire.
export async function getIdToken() {
  const session = read();
  if (!session) return null;
  if (session.expiresAt - Date.now() > 60_000) return session.idToken;
  try {
    const data = await cognito("InitiateAuth", {
      AuthFlow: "REFRESH_TOKEN_AUTH",
      AuthParameters: { REFRESH_TOKEN: session.refreshToken },
    });
    const result = data.AuthenticationResult;
    write({ ...session, idToken: result.IdToken, expiresAt: Date.now() + result.ExpiresIn * 1000 });
    return result.IdToken;
  } catch {
    signOut();
    return null;
  }
}