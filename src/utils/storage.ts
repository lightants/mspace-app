import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';
import type { Booking, MembershipApplication } from '../types';

export async function getMembership(): Promise<MembershipApplication | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.membership);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MembershipApplication;
  } catch {
    return null;
  }
}

export async function saveMembership(data: MembershipApplication): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.membership, JSON.stringify(data));
}

export async function isMembershipActive(): Promise<boolean> {
  const m = await getMembership();
  return Boolean(m?.membershipActive);
}

export async function getBookings(): Promise<Booking[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.bookings);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Booking[];
  } catch {
    return [];
  }
}

export async function saveBooking(booking: Booking): Promise<void> {
  const list = await getBookings();
  list.unshift(booking);
  await AsyncStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(list));
}

export async function savePushToken(token: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.pushToken, token);
}

export async function getPushToken(): Promise<string | null> {
  return AsyncStorage.getItem(STORAGE_KEYS.pushToken);
}

export function makeBookingRef(): string {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MS-${t}-${r}`;
}
