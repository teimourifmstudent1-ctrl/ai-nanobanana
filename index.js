// 1) بارگذاری تنظیمات از .env
require("dotenv").config();

// 2) اگر دوست داری بدون نصب axios کار کنی، از fetch داخلی Node استفاده می‌کنیم
//    (نیاز است Node نسخه جدید باشد؛ در محیط‌های آنلاین معمولاً هست)
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.NANOBANANA_API_KEY;
const ENDPOINT = process.env.NANOBANANA_ENDPOINT || "https://api.nanobanana.example/v1";

// 3) تابع تولید تصویر با پرامپت
async function generateImage(prompt, style = "default") {
  if (!API_KEY) throw new Error("کلید API تنظیم نشده است (NANOBANANA_API_KEY).");
  const res = await fetch(`${ENDPOINT}/images/generate`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt, style })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json(); // معمولاً لینک/شناسه تصویر برمی‌گردد
}

// 4) تابع ویرایش تصویر آپلودشده با پرامپت
async function editImageWithPrompt(imagePath, prompt, style = "default") {
  if (!API_KEY) throw new Error("کلید API تنظیم نشده است (NANOBANANA_API_KEY).");
  const imageBytes = fs.readFileSync(imagePath);
  const res = await fetch(`${ENDPOINT}/images/edit`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/octet-stream",
      "X-Prompt": prompt,
      "X-Style": style
    },
    body: imageBytes
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

// 5) اجرای نمونه‌ها (می‌توانی بعداً حذف/تغییر بدهی)
(async () => {
  try {
    console.log("🎨 تولید تصویر جدید...");
    const gen = await generateImage("یک پوستر علمی با تم آبی و متن خوانا", "clean");
    console.log("نتیجه تولید:", gen);

    console.log("🖌️ ویرایش تصویر آپلودشده...");
    const imgPath = path.join(__dirname, "sample.jpg"); // فایل sample.jpg را در ریشه پروژه قرار بده
    if (fs.existsSync(imgPath)) {
      const edit = await editImageWithPrompt(imgPath, "لباس شخصیت را آبی کن", "realistic");
      console.log("نتیجه ویرایش:", edit);
    } else {
      console.log("⚠️ فایل sample.jpg پیدا نشد؛ برای تست ویرایش یک تصویر اضافه کن.");
    }
  } catch (err) {
    console.error("❌ خطا:", err.message);
  }
})();
