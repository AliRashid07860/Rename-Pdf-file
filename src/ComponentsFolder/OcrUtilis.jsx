import Tesseract from "tesseract.js";

export const extractTextWithOCR = async (imageDataUrl) => {
  const result = await Tesseract.recognize(
    imageDataUrl,
    "eng",
    {
      logger: m => console.log(m) // progress
    }
  );

  return result.data.text;
};
