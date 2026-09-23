export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  avatar?: string;
  createdAt: string;
}

export interface UserAddress {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}
