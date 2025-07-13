import { Schema, model } from "mongoose";
// const slugify = require("slugify").default;
import slugify from "../utils/slugifyWorkAroundEsModule.util.js";
import { Post } from "./post.model.js";
import { AppError } from "../utils/apiError.util.js";
import { StatusCodes } from "http-status-codes";
import { BlogDocumentType, BlogModelType } from "../types/blogModel.js";
import { TipTapDocument, TipTapNode } from "../types/TipTap.type.js";
const blogSchema = new Schema<BlogDocumentType, BlogModelType>({
  title: {
    type: String,
    required: true,
    maxLength: 150,
  },
  slug: {
    type: String,
  },
  content_json: {
    type: Schema.Types.Mixed, // TipTap or EditorJS content
    required: true,
  },
  content_html: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    maxLength: 200,
  },
  coverImage: String,
  tags: [String],
  seo: {
    metaTitle: String,
    metaDesc: String,
    canonicalUrl: String,
  },
  scheduledAt: Date,
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
  },
});
blogSchema.index({ owner: 1, slug: 1 }, { unique: true });

blogSchema.pre("save", function (next) {
  this.slug = slugify(this.title);
  if (!this?.excerpt) {
    const paragraph = this.content_json.content.find(
      (item: TipTapNode) => item.type === "paragraph"
    );

    if (!paragraph || !paragraph?.content || !paragraph.content[0].text) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Blog must contain at least one paragraph to generate excerpt."
      );
    }

    this.excerpt = paragraph.content[0].text.slice(0, 200);
  }
  if (!this.seo) {
    this.seo = {};
  }
  if (!this.seo?.metaTitle) {
    this.seo.metaTitle = this.title;
  }
  if (!this.seo.metaDesc) {
    const paragraph = this.content_json.content.find(
      (item: TipTapNode) => item.type === "paragraph"
    );

    if (!paragraph || !paragraph?.content || !paragraph.content[0].text) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Blog must contain at least one paragraph to generate SEO metaDesc."
      );
    }
    this.seo.metaDesc = paragraph.content[0].text.slice(0, 100);
  }

  next();
});
export const Blog = Post.discriminator<BlogDocumentType, BlogModelType>(
  "Blog",
  blogSchema
);
