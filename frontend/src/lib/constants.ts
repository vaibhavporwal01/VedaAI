export const DESIGN_TOKENS = {
  colors: {
    brand: "#E8452A",
    orangeButton: "#FF5623",
    primary: "#1A1A1A",
    ink: "#303030",
    muted: "#6B7280",
    mutedMcp: "#5E5E5E",
    border: "#E5E7EB",
    page: "#D9D9D9",
    soft: "#EEEEEE",
    white: "#FFFFFF",
    disabled: "#A9A9A9",
    success: "#22C55E"
  },
  layout: {
    desktopSidebar: 304,
    desktopRail: 1100,
    topbarHeight: 56,
    mobileRail: 373,
    mobileBottomNav: 72
  }
} as const;

export const APP_PROFILE = {
  name: "Vaibhav Porwal",
  initials: "VP",
  schoolName: "Delhi Public School",
  schoolLocation: "Bokaro Steel City"
} as const;

export const DEFAULT_QUESTION_TYPES = [
  { type: "Multiple Choice Questions", count: 4, marks: 1 },
  { type: "Short Questions", count: 3, marks: 2 },
  { type: "Diagram/Graph-Based Questions", count: 5, marks: 5 },
  { type: "Numerical Problems", count: 5, marks: 5 }
];

export const QUESTION_TYPE_OPTIONS = [
  "Multiple Choice Questions",
  "Short Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "Long Answer Questions",
  "Case Study Questions"
];

export const DEFAULT_ASSIGNMENT_CONTEXT = {
  title: "",
  subject: "",
  grade: "",
  topic: "",
  timeAllowed: "45 minutes"
};
