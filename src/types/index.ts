export type Booking = {
  id: string;
  date: string;
  startHour: number;
  hours: number;
  name: string;
  phone: string;
  ratePerHour: number;
  total: number;
  isMemberRate: boolean;
  bookingRef: string;
  createdAt: string;
  paidPlaceholder: boolean;
};

export type MembershipApplication = {
  name: string;
  phone: string;
  email: string;
  notes: string;
  appliedAt: string;
  status: 'pending' | 'active';
  membershipActive: boolean;
};

export type Partner = {
  id: string;
  name: string;
  note?: string;
};
