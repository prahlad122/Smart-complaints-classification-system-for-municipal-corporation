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

  // Parks & Recreation
  if (
    t.includes("park") ||
    t.includes("garden") ||
    t.includes("playground") ||
    t.includes("tree") ||
    t.includes("bench") ||
    t.includes("grass") ||
    t.includes("field")
  ) {
    return "Parks & Recreation";
  }

  return "Other";
};

export const detectPriority = (text) => {
  const t = text.toLowerCase();

  // Critical — emergencies
  if (
    t.includes("flood") ||
    t.includes("collapse") ||
    t.includes("gas leak") ||
    t.includes("explosion") ||
    t.includes("electrocution") ||
    t.includes("emergency")
  ) {
    return "Critical";
  }

  // High — dangerous situations
  if (
    t.includes("electric shock") ||
    t.includes("fire") ||
    t.includes("accident") ||
    t.includes("live wire")
  ) {
    return "High";
  }

  // Medium — service disruptions
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
  Sanitation: "Waste Management Department",
  "Road Maintenance": "Public Works Department",
  Electricity: "Electricity Board",
  "Water Supply": "Water Department",
  "Parks & Recreation": "Parks Department",
  Other: "General Department",
};

/**
 * Fallback classification using keyword rules.
 * Returns the same shape as AI classification for consistency.
 */
export const getFallbackResult = (title, description) => {
  const text = `${title} ${description}`.toLowerCase().trim();

  const category = classifyComplaint(text);
  const priority = detectPriority(text);

  return {
    category,
    priority,
    confidence: 0.6,
    summary: "Rule-based classification",
  };
};