// types/express/index.d.ts
import { UserDocumentType } from "../models/User.ts"; // update with correct path

declare global {
  namespace Express {
    interface Request {
      user?: UserDocumentType;
    }
  }
}
