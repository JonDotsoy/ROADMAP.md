import { settings } from "../../../settings";

export class Auth {
  getToken(req: Request) {
    const staticToken = settings.auth.staticToken;
    if (!staticToken) return null;
    const authorizationHeader = req.headers.get("authorization");
    if (!authorizationHeader) return null;
    const [authorizationType, authorizationToken] =
      authorizationHeader.split(" ");
    if (authorizationType !== "Bearer") return null;
    return {
      type: authorizationType,
      token: authorizationToken,
    };
  }

  authRequest(req: Request) {
    const staticToken = settings.auth.staticToken;
    if (!staticToken) return false;
    const token = this.getToken(req);
    if (!token) return false;
    if (token.token !== staticToken) return false;
    return true;
  }
}

export const auth = new Auth();
