export const CONTACT = {
  company: "TalkSasa",
  address: {
    building: "Viewpark Towers, 13th Floor",
    street: "Monrovia Street",
    city: "Nairobi",
    country: "Kenya",
    postalCode: "00100",
    /** Single-line for display */
    display: "Viewpark Towers, 13th Floor, Monrovia Street, Nairobi, Kenya",
    /** Schema.org streetAddress */
    streetAddress: "Viewpark Towers, 13th Floor, Monrovia Street",
  },
  phones: [
    { display: "0712 295 880", tel: "+254712295880", international: "+254 712 295 880" },
    { display: "0781 000 403", tel: "+254781000403", international: "+254 781 000 403" },
  ],
  emails: [
    { address: "info@talksasa.com", label: "General enquiries" },
    { address: "sales@talksasa.com", label: "Sales" },
  ],
  whatsapp: "254712295880",
} as const;

export const PRIMARY_PHONE = CONTACT.phones[0];
export const SALES_PHONE = CONTACT.phones[1];
export const INFO_EMAIL = CONTACT.emails[0].address;
export const SALES_EMAIL = CONTACT.emails[1].address;
