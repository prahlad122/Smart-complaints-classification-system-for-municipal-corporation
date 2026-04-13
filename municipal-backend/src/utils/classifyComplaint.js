export const classifyComplaint = (text) => {
  const t = text.toLowerCase();

  // Sanitation
  if (
    t.includes("garbage") ||
    t.includes("waste") ||
    t.includes("trash") ||
    t.includes("dustbin") ||
    t.includes("cleaning") ||
    t.includes("dirty")
  ) {
    return "Sanitation";
  }

  // Road
  if (
    t.includes("road") ||
    t.includes("pothole") ||
    t.includes("street") ||
    t.includes("bridge") ||
    t.includes("highway")
  ) {
    return "Road Maintenance";
  }

  // Electricity
  if (
    t.includes("light") ||
    t.includes("electric") ||
    t.includes("power") ||
    t.includes("streetlight") ||
    t.includes("pole") ||
    t.includes("wire")
  ) {
    return "Electricity";
  }

  // Water
  if (
    t.includes("water") ||
    t.includes("pipe") ||
    t.includes("leak") ||
    t.includes("pipeline") ||
    t.includes("sewage") ||
    t.includes("drain")
  ) {
    return "Water Supply";
  }

  return "Other";
};

export const detectPriority = (text) => {
  const t = text.toLowerCase();

  if (
    t.includes("electric shock") ||
    t.includes("fire") ||
    t.includes("accident") ||
    t.includes("live wire")
  ) {
    return "High";
  }

  if (
    t.includes("garbage") ||
    t.includes("water leak") ||
    t.includes("sewage")
  ) {
    return "Medium";
  }

  return "Low";
};

export const departmentMap = {
  "Sanitation": "Waste Management Department",
  "Road Maintenance": "Public Works Department",
  "Electricity": "Electricity Board",
  "Water Supply": "Water Department",
  "Other": "General Department"
};