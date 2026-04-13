export const classifyComplaint = (text) => {
  const t = text.toLowerCase();

  if (t.includes("garbage") || t.includes("waste") || t.includes("trash"))
    return "Sanitation";

  if (t.includes("road") || t.includes("pothole") || t.includes("street"))
    return "Road Maintenance";

  if (t.includes("light") || t.includes("electric") || t.includes("power"))
    return "Electricity";

  if (t.includes("water") || t.includes("pipe") || t.includes("leak"))
    return "Water Supply";

  return "Uncategorized";
};
