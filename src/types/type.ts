export type DashboardRole = "admin" | "owner" | "customer";

export type EquipmentRentalType = "Daily" | "Weekly" | "Monthly";

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