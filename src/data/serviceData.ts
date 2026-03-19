export interface ServiceInfo {
  id: string;
  name: string;
  category: string;
  duration: number; // minutes
  documents: string[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string; // lucide icon name
  services: ServiceInfo[];
}

const SERVICES: Record<string, ServiceInfo[]> = {
  "Account Services": [
    {
      id: "kyc-update",
      name: "KYC Update",
      category: "Account Services",
      duration: 10,
      documents: ["Aadhaar Card", "PAN Card", "Passport-size Photo", "Address Proof (if changed)"],
    },
    {
      id: "mobile-update",
      name: "Mobile Update",
      category: "Account Services",
      duration: 5,
      documents: ["Aadhaar Card or PAN Card", "Active Mobile Phone (for OTP)"],
    },
    {
      id: "address-change",
      name: "Address Change",
      category: "Account Services",
      duration: 10,
      documents: ["Aadhaar Card or Passport or Driving License", "Recent Utility Bill"],
    },
  ],
  "Loan Services": [
    {
      id: "personal-loan",
      name: "Personal Loan",
      category: "Loan Services",
      duration: 30,
      documents: ["PAN Card", "Aadhaar Card", "Salary Slips (last 3 months)", "Bank Statement (last 6 months)"],
    },
    {
      id: "home-loan-enquiry",
      name: "Home Loan Enquiry",
      category: "Loan Services",
      duration: 30,
      documents: ["PAN Card", "Aadhaar Card", "Income Proof", "Bank Statement (6–12 months)", "Property Documents (optional)"],
    },
  ],
  "Cash Services": [
    {
      id: "deposit",
      name: "Deposit",
      category: "Cash Services",
      duration: 5,
      documents: ["Cash", "Account Number"],
    },
    {
      id: "withdraw",
      name: "Withdraw",
      category: "Cash Services",
      duration: 5,
      documents: ["Withdrawal Slip or Cheque", "ID Proof (if required)"],
    },
  ],
  "Other Services": [
    {
      id: "locker",
      name: "Locker",
      category: "Other Services",
      duration: 20,
      documents: ["Locker Key", "ID Proof (if required)"],
    },
    {
      id: "seeding",
      name: "Seeding (Aadhaar / PAN)",
      category: "Other Services",
      duration: 10,
      documents: ["Aadhaar Card", "PAN Card", "Bank Account Details", "Aadhaar-linked Mobile (for OTP)"],
    },
  ],
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: "account-services", name: "Account Services", icon: "CreditCard", services: SERVICES["Account Services"] },
  { id: "loan-services", name: "Loan Services", icon: "Wallet", services: SERVICES["Loan Services"] },
  { id: "cash-services", name: "Cash Services", icon: "Landmark", services: SERVICES["Cash Services"] },
  { id: "other-services", name: "Other Services", icon: "MoreHorizontal", services: SERVICES["Other Services"] },
];

export const ALL_SERVICES: ServiceInfo[] = SERVICE_CATEGORIES.flatMap((c) => c.services);

export const getServiceById = (id: string): ServiceInfo | undefined => ALL_SERVICES.find((s) => s.id === id);

export const getCategoryByServiceId = (id: string): ServiceCategory | undefined =>
  SERVICE_CATEGORIES.find((c) => c.services.some((s) => s.id === id));

export const TIME_SLOTS = [
  "09:00 – 10:00",
  "10:00 – 11:00",
  "11:00 – 12:00",
  "01:00 – 02:00",
  "02:00 – 03:00",
  "03:00 – 04:00",
];

export const SLOT_CAPACITY = 20;
