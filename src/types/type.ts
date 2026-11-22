export type DashboardRole = "admin" | "owner" | "customer";

export type EquipmentRentalType = "Daily" | "Weekly" | "Monthly";
export type EquipmentStatus = "pending" | "approved" | "rejected";
export type RentalPaymentStatus = "paid" | "pending" | "failed";
export type RentalBookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export type Equipment = {
  _id: string;
  name: string;
  category: string;
  image?: string | null;
  location: string;
  rentalPrice: number;
  rentalType: EquipmentRentalType;
  availableQuantity: number;
  status: string;
};

export type OwnerEquipment = Omit<Equipment, "status" | "image"> & {
  brand: string;
  model: string;
  image: string;
  status: EquipmentStatus;
};

export type OwnerRental = {
  _id: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    photo?: string;
  };
  equipment: {
    name: string;
    category?: string;
    image?: string;
  };
  startDate: string;
  endDate: string;
  requiredQuantity: number;
  totalAmount: number;
  paymentStatus: RentalPaymentStatus;
  bookingStatus: RentalBookingStatus;
};

export type RentalBadgeStyle = {
  label: string;
  badge: string;
  dot: string;
};

export type RentalApiResult = {
  data?: unknown;
  message?: string;
};

export type EquipmentOwner = {
  name: string;
  email: string;
  image?: string | null;
  photo?: string | null;
  phone?: string | null;
};

export type EquipmentDetails = Omit<Equipment, "status" | "image"> & {
  description: string;
  image?: string | null;
  condition: string;
  brand: string;
  model: string;
  rentalTerms: string[];
  owner: EquipmentOwner;
};

export type EquipmentFilters = {
  search: string;
  location: string;
  category: string;
  rentalType: string;
  availability: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
};

export type TcommonAPIResponse<T> ={
  success: boolean,
  message: string,
  data: T,
}