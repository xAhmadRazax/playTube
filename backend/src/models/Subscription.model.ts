import { Schema, model } from "mongoose";
import {
  SubscriptionDocumentType,
  SubscriptionModelType,
} from "../types/subscriptionMode.type.js";

const subscriptionSchema = new Schema<
  SubscriptionDocumentType,
  SubscriptionModelType
>(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const SubscriptionModel = model<
  SubscriptionDocumentType,
  SubscriptionModelType
>("Subscription", subscriptionSchema);
