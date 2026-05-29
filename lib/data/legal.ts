/**
 * Legal pages, seed copy (brief §4). Editable via the Sanity `page` schema in
 * Phase 2. NOTE TO OWNER: this is generic placeholder wording, please have it
 * reviewed before relying on it.
 */
export interface LegalDoc {
  slug: string;
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
}

export const legalDocs: Record<string, LegalDoc> = {
  privacy: {
    slug: "privacy",
    title: "Privacy Notice",
    intro:
      "This notice explains how Electric Buggies collects and uses personal data. It is provided as a starting point and should be reviewed by the owner before launch.",
    sections: [
      { heading: "What we collect", body: "When you submit a quote request or contact form we collect the details you provide, your name, email, phone, company and message, so we can respond to your enquiry." },
      { heading: "How we use it", body: "We use your information solely to respond to your enquiry and, where you have agreed, to keep you informed about Electric Buggies. We do not sell your data." },
      { heading: "Retention", body: "We keep enquiry data only as long as necessary to deal with your request and for our legitimate business records." },
      { heading: "Your rights", body: "You may request access to, correction of, or deletion of your personal data at any time by contacting us." },
      { heading: "Contact", body: "For any privacy query, please contact us using the details on our contact page." },
    ],
  },
  terms: {
    slug: "terms",
    title: "Terms of Use",
    intro:
      "These terms govern use of the Electric Buggies website. They are provided as a starting point and should be reviewed by the owner before launch.",
    sections: [
      { heading: "Indicative pricing", body: "All prices shown, including configurator totals, are indicative only and do not constitute an offer. Final pricing is confirmed in a written quotation." },
      { heading: "Content", body: "Vehicle renders and specifications are illustrative. Specifications may change and are confirmed at the point of quotation." },
      { heading: "Intellectual property", body: "All content on this site is the property of Electric Buggies unless otherwise stated and may not be reproduced without permission." },
      { heading: "Liability", body: "The website is provided on an 'as is' basis. We accept no liability for reliance on indicative information presented here." },
    ],
  },
  cookies: {
    slug: "cookies",
    title: "Cookie Notice",
    intro:
      "This notice explains how cookies are used on the Electric Buggies website. It is provided as a starting point and should be reviewed by the owner before launch.",
    sections: [
      { heading: "Essential cookies", body: "We use a small number of cookies and local storage entries necessary for the site to function, for example, to remember a saved vehicle build on your device." },
      { heading: "Analytics", body: "Where enabled, we use privacy-respecting analytics to understand how the site is used and to improve it. No analytics are used to identify you personally." },
      { heading: "Managing cookies", body: "You can control or delete cookies through your browser settings at any time. Doing so may affect some site features." },
    ],
  },
};
