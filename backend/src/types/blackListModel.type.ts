import { Model, Document } from "mongoose";

export interface BlacklistSchemaType {
  token: string;
  expireAt: Date;
}
export interface BlacklistDocumentType extends BlacklistSchemaType, Document {}
export interface BlacklistModelType
  extends BlacklistSchemaType,
    Model<BlacklistDocumentType> {}
