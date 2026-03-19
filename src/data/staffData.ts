export interface StaffMember {
  branchCode: string;
  name: string;
  phone: string;
}

export const STAFF_DB: StaffMember[] = [
  { branchCode: "INB301", name: "Ramesh Kumar", phone: "9878953210" },
  { branchCode: "INB302", name: "Priya Sharma", phone: "9876543211" },
  { branchCode: "INB303", name: "Suresh Babu", phone: "9876543212" },
  { branchCode: "INB304", name: "Kavya Nair", phone: "9876543213" },
  { branchCode: "CUB201", name: "Arvind Raj", phone: "9876543214" },
  { branchCode: "CUB202", name: "Divya Lakshmi", phone: "9876543215" },
  { branchCode: "CUB203", name: "Manoj Kumar", phone: "9876543216" },
  { branchCode: "CUB204", name: "Sneha Reddy", phone: "9876543217" },
  { branchCode: "CAN001", name: "Karthik Selvan", phone: "9876543218" },
  { branchCode: "CAN002", name: "Meena Krishnan", phone: "9876543219" },
  { branchCode: "CAN003", name: "Vignesh Kumar", phone: "9876543220" },
  { branchCode: "CAN004", name: "Anitha Ravi", phone: "9876543221" },
  { branchCode: "SBI001", name: "Rajesh Iyer", phone: "9876543222" },
  { branchCode: "SBI002", name: "Deepa Subramanian", phone: "9876543223" },
  { branchCode: "SBI003", name: "Prakash Menon", phone: "9876543224" },
  { branchCode: "SBI004", name: "Lakshmi Narayanan", phone: "9876543225" },
];

export const BRANCH_CODE_TO_BANK: Record<string, string> = {
  INB301: "Indian Bank", INB302: "Indian Bank", INB303: "Indian Bank", INB304: "Indian Bank",
  CUB201: "City Union Bank", CUB202: "City Union Bank", CUB203: "City Union Bank", CUB204: "City Union Bank",
  CAN001: "Canara Bank", CAN002: "Canara Bank", CAN003: "Canara Bank", CAN004: "Canara Bank",
  SBI001: "State Bank of India", SBI002: "State Bank of India", SBI003: "State Bank of India", SBI004: "State Bank of India",
};

export const validateStaff = (bankName: string, branchCode: string, phone: string): StaffMember | null => {
  const bank = BRANCH_CODE_TO_BANK[branchCode];
  if (!bank || bank !== bankName) return null;
  return STAFF_DB.find((s) => s.branchCode === branchCode && s.phone === phone) || null;
};
