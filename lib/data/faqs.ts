/** Ownership FAQs — feeds the accordion and FAQPage JSON-LD (brief §5/§9). */
export interface Faq {
  question: string;
  answer: string;
  category: string;
}

export const faqs: Faq[] = [
  {
    category: "Ownership",
    question: "What warranty do Electric Buggies vehicles carry?",
    answer:
      "Every Electric Buggies vehicle is supplied with our standard 3-year warranty covering the drivetrain, battery and bodywork. Extended cover is available on request and confirmed at the point of quotation.",
  },
  {
    category: "Ownership",
    question: "Do you deliver across the UK?",
    answer:
      "Yes. We deliver and commission vehicles UK-wide, including the Scottish Highlands and the islands by arrangement. Delivery is coordinated directly with your grounds or facilities team.",
  },
  {
    category: "Battery & Charging",
    question: "How far will a vehicle travel on a charge?",
    answer:
      "Range varies by model and specification, from around 70 to 90 km on a full charge. Indicative figures are shown on each model page; real-world range depends on terrain, load and driving style.",
  },
  {
    category: "Battery & Charging",
    question: "How are the vehicles charged?",
    answer:
      "All models charge from a standard 13A domestic socket, typically overnight. A fast-charge upgrade is available where quicker turnaround is required.",
  },
  {
    category: "Servicing",
    question: "How are the vehicles serviced and supported?",
    answer:
      "We provide scheduled servicing and responsive support through our UK network. Electric drivetrains have far fewer moving parts than petrol equivalents, so maintenance is minimal and predictable.",
  },
  {
    category: "Purchasing",
    question: "Can I buy directly from the website?",
    answer:
      "Electric Buggies vehicles are bespoke commissions, so every sale begins with a tailored quotation rather than a checkout. Configure your vehicle, request a quote, and we will respond with pricing, lead time and next steps.",
  },
  {
    category: "Purchasing",
    question: "Do you offer business and fleet purchasing?",
    answer:
      "Yes. We work extensively with estates, resorts, golf clubs and production companies on single vehicles and fleets. Select 'Business' on the quote form and we will tailor terms, livery and fleet pricing.",
  },
];
