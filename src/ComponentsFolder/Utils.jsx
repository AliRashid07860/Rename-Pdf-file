export const extractAwb = (text) => {
  const cleaned = text.replace(/\s+/g, "");
  const match = cleaned.match(/(391\d{8}|349\d{8})/);
  return match ? match[1] : null;
};

export const detectType = (text) => {
  const t = text.toLowerCase();
  if (t.includes("invoice")) return "invoice";
  if (t.includes("shipping")) return "shipping";
  if (t.includes("airway") || t.includes("waybill")) return "airwaybill";
  return null;
};
