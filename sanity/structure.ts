import type { StructureResolver } from "sanity/structure";

/** Desk structure — pins the singletons and groups content (brief §7). */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Homepage")
        .id("homepage")
        .child(S.document().schemaType("homepage").documentId("homepage")),
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.documentTypeListItem("model").title("Models"),
      S.documentTypeListItem("sector").title("Sectors"),
      S.documentTypeListItem("location").title("Locations"),
      S.divider(),
      S.documentTypeListItem("post").title("Journal posts"),
      S.documentTypeListItem("category").title("Blog categories"),
      S.documentTypeListItem("landingPage").title("Landing pages"),
      S.documentTypeListItem("page").title("Pages"),
      S.documentTypeListItem("faq").title("FAQs"),
      S.divider(),
      S.listItem()
        .title("Configurator options")
        .child(
          S.list()
            .title("Configurator options")
            .items([
              S.documentTypeListItem("colour").title("Exterior colours"),
              S.documentTypeListItem("roof").title("Roofs"),
              S.documentTypeListItem("wheel").title("Wheels"),
              S.documentTypeListItem("upholstery").title("Upholstery"),
              S.documentTypeListItem("accessory").title("Accessories"),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem("lead").title("Leads / Enquiries"),
      S.documentTypeListItem("quoteRequest").title("Quote requests"),
    ]);
