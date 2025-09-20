import { ObjectId } from "mongodb";
import { Document, Model } from "mongoose";
// this function generate a random mongo id which we later assign to the model
export const generateRandomIdMongoDb = async <T extends Document>(
  model: Model<T>
): Promise<ObjectId> => {
  let id = new ObjectId();

  // there is very little chance that generated it
  // based on some already existed id here we are checking it for that
  if (await model.findById(id)) {
    return generateRandomIdMongoDb(model);
  }

  return id;
};
