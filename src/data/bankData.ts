export const BANKS = [
  "Indian Bank",
  "City Union Bank",
  "Canara Bank",
  "State Bank of India",
];

export const BRANCHES: Record<string, { code: string; name: string }[]> = {
  "Indian Bank": [
    { code: "INB301", name: "Chennai Mount Road Branch" },
    { code: "INB302", name: "Vellore Branch" },
    { code: "INB303", name: "Thanjavur Branch" },
    { code: "INB304", name: "Thiruchirappalli Branch" },
  ],
  "City Union Bank": [
    { code: "CUB201", name: "Kumbakonam Main Branch" },
    { code: "CUB202", name: "Trichy Branch" },
    { code: "CUB203", name: "Erode Branch" },
    { code: "CUB204", name: "Chennai Adyar Branch" },
  ],
  "Canara Bank": [
    { code: "CAN001", name: "Chennai T-Nagar Branch" },
    { code: "CAN002", name: "Coimbatore Main Branch" },
    { code: "CAN003", name: "Madurai Branch" },
    { code: "CAN004", name: "Trichy Branch" },
  ],
  "State Bank of India": [
    { code: "SBI001", name: "Chennai Main Branch" },
    { code: "SBI002", name: "Coimbatore R S Puram Branch" },
    { code: "SBI003", name: "Madurai Main Branch" },
    { code: "SBI004", name: "Trichy Cantonment Branch" },
  ],
};

export const USER_DB: Record<string, string> = {
  "9876543210": "Vishwaraj G",
  "9123456780": "Santhosh T",
  "9001122334": "Lathika L J",
  "9345678123": "Hindhu G",
  "9789012345": "Aravindanath T R",
};

export const FIXED_OTP = "123456";
