import { Document, Model } from "mongoose";
import { UserDocumentType } from "./userModel.type.js";

export interface SubscriptionType {
  channel: UserDocumentType;
  subscriber: UserDocumentType;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionDocumentType extends SubscriptionType, Document {}

export interface SubscriptionModelType
  extends Model<SubscriptionDocumentType> {}
