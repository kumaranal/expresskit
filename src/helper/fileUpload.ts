import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEW_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SECRETKEY;
const BUCKET_NAME = process.env.SUPABASE_BUCKET;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const uploadFileToSupabase = async (filePath, fileName) => {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, filePath, {
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data: publicURL } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return publicURL;
  } catch (error) {
    throw error;
  }
};

export default uploadFileToSupabase;
