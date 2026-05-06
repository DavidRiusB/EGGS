import { AppointmentSlot } from 'src/common/enums/appointment-slot.enum';

export type AvailabilityDay = {
  date: string;
  slots: { slot: AppointmentSlot; available: boolean }[];
};

export type BookedSlot = {
  date: string; // "2026-05-06" — Postgres date column comes back as a string
  slot: AppointmentSlot;
};
