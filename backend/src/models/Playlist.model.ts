import { Schema,Types,model } from "mongoose";


const playlistSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    videos: [{ type: Types.ObjectId, ref: "Video" , }],
    owner: { type: Types.ObjectId, ref: "User", },
},{
    timestamps: true,
})

export  const Playlist = model("Playlist", playlistSchema);

