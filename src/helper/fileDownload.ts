import { createClient } from "@supabase/supabase-js";
import { createCustomError } from "../utils/customError";
import getImageName from "./imageName";

const SUPABASE_URL = process.env.NEW_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRETKEY;
const BUCKET_NAME = process.env.SUPABASE_BUCKET;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

const fileDownloadFromSupabase = async (filePath) => {
  try {
    const imageName = await getImageName(filePath);
    console.log("imageName", imageName);
    const { data, error } = await supabaseClient.storage
      .from(BUCKET_NAME)
      .download(imageName);
    if (error) {
      console.log("error", error);
      throw createCustomError(error.message, 401);
    }
    return data;
  } catch (error) {
    throw createCustomError(error.message, 500);
  }
};

export default fileDownloadFromSupabase;
