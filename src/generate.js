require("dotenv").config();
const axios = require("axios");

const API_KEY = process.env.NANOBANANA_API_KEY;
const ENDPOINT = process.env.NANOBANANA_ENDPOINT;

async function generateImage(prompt) {
  const res = await axios.post(`${ENDPOINT}/images/generate`, {
    prompt: prompt,
    style: "clean"
  }, {
    headers: {
      Authorization: `Bearer ${API_KEY}`
    }
  });
  return res.data;
}

(async () => {
  const result = await generateImage("یک پوستر علمی با تم آبی");
  console.log("تصویر تولید شده:", result);
})();
