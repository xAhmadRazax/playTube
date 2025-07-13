import { Model } from "mongoose";
import { PostDocumentType } from "./postModel.type.js";
import { TipTapDocument } from "./TipTap.type.js";

export interface BlogSchemaType extends PostDocumentType {
  title: string;
  slug: string;
  content_json: TipTapDocument;
  content_html: string;
  excerpt?: string;
  seo: {
    metaTitle?: string;
    metaDesc?: string;
    canonicalUrl?: string;
  };
  scheduledAt: Date;
  coverImage: string;
  tags: string[];
  status: "draft" | "published" | "archived";
}

export interface BlogDocumentType extends BlogSchemaType, Document {}
export interface BlogModelType extends Model<BlogDocumentType> {}
