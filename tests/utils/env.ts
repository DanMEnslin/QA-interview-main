import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

export default class ENV {
  public static BASE_URL = process.env.BASE_URL;
}