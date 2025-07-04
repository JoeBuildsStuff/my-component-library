// Base table types (matching your database schema)
export type Contact = {
  id: string;
  created_at?: string;
  updated_at?: string;
  first_name?: string;
  last_name?: string;
  city?: string;
  state?: string;
  company_id?: string | null;
  job_title?: string;
  description?: string;
  linkedin?: string;
}

export type Company = {
  id: string;
  created_at?: string;
  name: string;
  description?: string;
}

export type ContactEmail = {
  id: string;
  contact_id: string;
  email: string;
  display_order: number;
  created_at?: string;
}

export type ContactPhone = {
  id: string;
  contact_id: string;
  phone: string;
  display_order: number;
  created_at?: string;
}

// Enhanced types with relationships
export type ContactWithCompany = Contact & {
  company?: Company;
}

export type ContactWithRelations = Contact & {
  company?: Company;
  emails: ContactEmail[];
  phones: ContactPhone[];
}

// Form-specific types (for your React component)
export type ContactFormData = {
  firstName: string;
  lastName: string;
  emails: string[];
  phones: string[];
  city: string;
  state: string;
  company: string;
  description: string;
  linkedin: string;
  jobTitle: string;
}

// API response types
export type ContactListResponse = {
  contacts: ContactWithCompany[];
  total: number;
}

export type ContactDetailResponse = ContactWithRelations;

// Insert/Update types (without generated fields)
export type ContactInsert = Omit<Contact, 'id' | 'created_at' | 'updated_at'>;
export type ContactUpdate = Partial<ContactInsert>;

export type ContactEmailInsert = Omit<ContactEmail, 'id' | 'created_at'>;
export type ContactPhoneInsert = Omit<ContactPhone, 'id' | 'created_at'>;

export type CompanyInsert = Omit<Company, 'id' | 'created_at'>;

// Utility types for the component
export type AttioContactData = {
  firstName: string;
  lastName: string;
  emails: string[];
  phones: string[];
  city: string;
  state: string;
  company: string;
  description: string;
  linkedin: string;
  jobTitle: string;
}