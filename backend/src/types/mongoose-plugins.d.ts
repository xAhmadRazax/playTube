// src/types/mongoose-plugins.d.ts
import { PluginFunction } from "mongoose";
import { VideoDocumentType } from "./videoMode.type";

declare module "mongoose-aggregate-paginate-v2" {
  const mongooseAggregatePaginate: PluginFunction<VideoDocumentType>;
  export default mongooseAggregatePaginate;
}
