import { ReactNode } from 'react';

export interface JobCategory {
  id: string;
  name: string;
}

export interface ApplicationFormData {
  firstName: string;
  lastName: string;
  position: string;
  dob: string;
  healthcareInsurance?: string;
  bloodGroup?: string;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  zipCode: string;
  country: string;
  linkedInProfile?: string;
  specializedField?: string;
  creditReportScreenshot: FileList | null;
}

export interface StepProps {
  onNext: () => void;
  onPrev: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}
