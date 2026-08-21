/**
 * Single source of every user-visible string, image path and price on the site.
 *
 * Copy is transcribed from the artist's previous Canva site
 * (https://tazcreates.my.canva.site/). Service names have had their typos
 * corrected; client review quotes are kept verbatim because they are real
 * people's words.
 *
 * Keeping copy here rather than inline also keeps JSX free of string literals,
 * which is what the `i18next/no-literal-string` lint rule is watching for.
 */

export const SITE = {
  artist: {
    name: "Tazmeen Zabiyaan",
    firstName: "Tazmeen",
    greeting: "Hi, I'm",
    role: "Portrait Artist",
    tagline: "A portrait artist based in Canada",
    signature: "— Taz",
    portrait: {
      src: "/photos/artist-mural.jpg",
      alt: "Tazmeen Zabiyaan standing in front of a blue and pink graffiti mural"
    },
    avatar: {
      src: "/photos/avatar-chibi.png",
      alt: "Tazmeen's illustrated self-portrait, holding a paintbrush and palette"
    }
  },

  meta: {
    description:
      "Hand-drawn custom portraits by Tazmeen Zabiyaan, a portrait artist based in Canada. Solo, duo and group commissions in acrylic, oil pastel and ink.",
    keywords: [
      "custom portrait",
      "hand drawn portrait",
      "commission artist",
      "Canada",
      "oil pastel",
      "acrylic painting",
      "anime portrait",
      "children's book illustrator"
    ]
  },

  cta: {
    primary: "Message me to order",
    href: "https://www.instagram.com/tazxtehz",
    closingTitle: "Support me & my art",
    closingBody: "Order your custom portraits today"
  },

  contact: {
    instagramHandle: "@tazxtehz",
    instagramUrl: "https://www.instagram.com/tazxtehz",
    email: "tazmeenzabiyaan8@gmail.com"
  },

  about: {
    eyebrow: "Commissions & Passion",
    title: "What I do",
    body: [
      "Every portrait starts on paper — pencil first, then colour, layer over layer, until the face on the page looks back the way the person does.",
      "I work in acrylic, oil pastel and ink, and I take commissions for people, couples, families, and characters. No two turn out the same, because no two people do."
    ],
    textures: [
      {
        src: "/texture/oil-pastels.png",
        alt: "An open box of well-used oil pastels in every colour"
      },
      {
        src: "/texture/brush-markers.png",
        alt: "A fan of pastel-coloured brush markers"
      }
    ]
  },

  services: [
    "Personal customized portraits of people",
    "Acrylic painting",
    "Oil pastel paintings",
    "Anime & cartoon characters sketched",
    "Children's book illustration",
    "Video editing & YouTube",
    "Scrapbook journaling",
    "Lettering"
  ],

  gallery: {
    eyebrow: "Selected work",
    title: "The portraits",
    body: "A few commissions, in the mediums they were made in.",
    items: [
      {
        id: "family-group",
        src: "/art/family-group.jpg",
        alt: "Illustrated family portrait of two parents, a child and a baby, titled Nayaz & Nayef's family",
        medium: "Ink & marker",
        caption: "Nayaz & Nayef's family",
        width: 600,
        height: 800
      },
      {
        id: "couple-duo",
        src: "/art/couple-duo.jpg",
        alt: "Illustrated portrait of a couple embracing, surrounded by hand-lettered text and stars",
        medium: "Markers",
        caption: "In every universe",
        width: 799,
        height: 786
      },
      {
        id: "solo-roses",
        src: "/art/solo-roses.jpg",
        alt: "Illustrated solo portrait of a woman with long dark red hair against a background of pink roses",
        medium: "Markers",
        caption: "Summer of roses",
        width: 800,
        height: 800
      },
      {
        id: "besties-graduation",
        src: "/art/besties-graduation.jpg",
        alt: "Illustrated portrait of two friends in graduation caps holding bouquets, titled Besties",
        medium: "Ink & marker",
        caption: "Besties",
        width: 800,
        height: 800
      },
      {
        id: "couple-green",
        src: "/art/couple-green.jpg",
        alt: "Illustrated portrait of a couple lying together on a green floral background",
        medium: "Markers",
        caption: "Resting",
        width: 600,
        height: 800
      },
      {
        id: "solo-green-dress",
        src: "/art/solo-green-dress.jpg",
        alt: "Illustrated portrait of a woman in a green dress against a teal heart",
        medium: "Markers",
        caption: "Green heart",
        width: 600,
        height: 800
      }
    ]
  },

  pricing: {
    eyebrow: "Commission a portrait",
    title: "Portrait options",
    body: "Pricing scales with the number of people in the frame. Message me with a reference photo and I'll quote the rest.",
    note: "Prices in CAD. Final quote depends on medium, size and detail.",
    tiers: [
      {
        id: "solo",
        tier: "Solo",
        price: "$15",
        people: "One person",
        artwork: "/art/solo-roses.jpg",
        alt: "Illustrated solo portrait of a woman with long dark red hair against pink roses"
      },
      {
        id: "duo",
        tier: "Duo",
        price: "$25",
        people: "Two people",
        artwork: "/art/couple-duo.jpg",
        alt: "Illustrated portrait of a couple embracing",
        featured: true
      },
      {
        id: "group",
        tier: "Group",
        price: "$35+",
        people: "Three or more",
        artwork: "/art/family-group.jpg",
        alt: "Illustrated family portrait of four people"
      }
    ]
  },

  reviews: {
    eyebrow: "What they say",
    title: "Client reviews",
    items: [
      {
        id: "hafsa",
        name: "Hafsa Gori",
        quote: "Thanks for capturing our beautiful moment so perfectly.",
        artwork: "/art/besties-graduation.jpg",
        alt: "Illustrated portrait of two friends in graduation caps"
      },
      {
        id: "kauther",
        name: "Kauther Idris",
        quote: "I love everything about my portrait, she captured me so flawlessly.",
        artwork: "/art/solo-green-dress.jpg",
        alt: "Illustrated portrait of a woman in a green dress"
      },
      {
        id: "tawsif",
        name: "Tawsif Azmayeen",
        quote:
          "Every detail about us and our moment together is captured so well. It's identical to us! We are obsessed.",
        artwork: "/art/couple-green.jpg",
        alt: "Illustrated portrait of a couple on a green floral background"
      }
    ],
    collage: {
      src: "/social/dm-collage-tall.jpg",
      width: 515,
      height: 798,
      alt: "A collage of Instagram messages from clients reacting to their finished portraits"
    }
  },

  /**
   * How a commission runs, start to finish.
   *
   * ⚠️ VERIFY BEFORE LAUNCH — the specifics below (turnaround windows, revision count,
   * deposit split) are drafted from what a commission of this size normally involves.
   * They are NOT taken from the old Canva site, which stated none of them. Every value
   * marked `verify: true` must be confirmed by the artist before this page goes live;
   * publishing invented terms is both a trust problem and, for the JSON-LD that quotes
   * them, a factual claim to search and answer engines.
   */
  process: {
    eyebrow: "How it works",
    title: "From your photo to your portrait",
    body: "Four steps, and you see the work before it is finished.",
    verify: true,
    steps: [
      {
        id: "enquiry",
        step: "01",
        title: "Send your reference",
        body: "Message me on Instagram or use the form below with the photo you want drawn, how many people are in it, and any deadline you are working to."
      },
      {
        id: "quote",
        step: "02",
        title: "Quote and deposit",
        body: "I confirm the price for the number of people and the medium, then start once the deposit is settled."
      },
      {
        id: "progress",
        step: "03",
        title: "Progress check",
        body: "You see the sketch before it is coloured, so anything that does not look like you gets fixed while it is still easy to change."
      },
      {
        id: "delivery",
        step: "04",
        title: "Final piece",
        body: "You get a high-resolution digital file. Physical originals can be shipped within Canada — ask when you enquire."
      }
    ]
  },

  /**
   * ⚠️ VERIFY BEFORE LAUNCH — same warning as `process` above. These answers are
   * question-shaped on purpose: they are the source for `faqSchema()`, which is what
   * answer engines quote. A wrong answer here becomes a wrong answer in ChatGPT.
   */
  faq: {
    eyebrow: "Before you ask",
    title: "Commission questions",
    verify: true,
    items: [
      {
        question: "How long does a custom portrait take?",
        answer:
          "Most portraits are finished within one to two weeks of the deposit. Group pieces with three or more people take longer, and rush work is possible if you tell me your deadline when you enquire."
      },
      {
        question: "What makes a good reference photo?",
        answer:
          "Good light on the face, in focus, and taken straight on rather than at a steep angle. A clear phone photo works fine. If you only have a low-resolution image, send it anyway and I will tell you honestly whether it will work."
      },
      {
        question: "How much does a portrait cost?",
        answer:
          "Pricing is by the number of people in the frame: $15 CAD for one person, $25 for two, and $35 or more for groups of three or more. The final quote depends on the medium, the size, and how much detail the piece needs."
      },
      {
        question: "Which mediums do you work in?",
        answer:
          "Acrylic, oil pastel, and ink with brush marker. I also sketch anime and cartoon characters, and take children's book illustration work. Tell me which you would like, or describe the feeling you want and I will suggest one."
      },
      {
        question: "Do I get a digital file or a physical piece?",
        answer:
          "Every commission includes a high-resolution digital file. The original physical piece can be shipped within Canada for the cost of postage — mention it when you enquire so I can quote it."
      },
      {
        question: "Can I ask for changes?",
        answer:
          "Yes. You see the sketch before any colour goes down, which is the point at which changes are easiest. Small adjustments after that are fine; a full redraw would be quoted as new work."
      }
    ]
  },

  /**
   * ⚠️ BLOCKED — `username` needs the artist's real Buy Me a Coffee handle. The section
   * renders a disabled state and logs a build-time warning until it is filled in, rather
   * than shipping a link that 404s.
   */
  support: {
    platform: "buymeacoffee",
    username: "__TODO__",
    eyebrow: "No commission needed",
    title: "Support the work",
    body: "If a portrait made you smile and you just want to say thanks, this keeps the pastels and paper stocked.",
    cta: "Buy me a coffee"
  },

  commission: {
    eyebrow: "Start a commission",
    title: "Tell me what to draw",
    body: "The more you tell me now, the faster I can quote you. Everything except the description is optional.",
    fields: {
      name: "Your name",
      email: "Email",
      emailHint: "So I can send the quote back to you.",
      portraitType: "Portrait type",
      portraitTypePlaceholder: "How many people?",
      people: "Number of people",
      medium: "Preferred medium",
      mediumPlaceholder: "No preference",
      deadline: "Deadline",
      deadlineHint: "Optional — tell me if this is for an occasion.",
      budget: "Budget",
      budgetHint: "Optional.",
      description: "What would you like drawn?",
      descriptionHint: "The photo, the people, the mood, anything that matters to you.",
      referenceUrl: "Reference photo link",
      referenceUrlHint: "Optional — a Drive, Dropbox, or Instagram link.",
      consent: "I'm happy for Tazmeen to email me about this commission.",
      submit: "Send commission request",
      submitting: "Sending…"
    },
    mediums: ["Acrylic", "Oil pastel", "Ink & marker", "Anime / cartoon style"],
    success: {
      title: "Request sent",
      body: "Thanks — I'll reply to your email within a couple of days."
    },
    error: {
      title: "That didn't send",
      body: "Something went wrong on my side. Message me on Instagram instead and I'll pick it up there."
    },
    unavailable:
      "The form is not connected yet. Message me on Instagram or email me directly and I'll reply the same way."
  },

  nav: {
    brand: "Tazmeen Zabiyaan",
    cta: "Commission",
    links: [
      { id: "about", label: "About", href: "#about" },
      { id: "work", label: "Work", href: "#work" },
      { id: "pricing", label: "Pricing", href: "#pricing" },
      { id: "faq", label: "FAQ", href: "#faq" },
      { id: "reviews", label: "Reviews", href: "#reviews" }
    ]
  },

  footer: {
    instagramLabel: "Instagram",
    emailLabel: "Email",
    rights: "All artwork © Tazmeen Zabiyaan"
  },

  /** Labels inside the notification email the artist receives. */
  email: {
    eyebrow: "New commission request",
    portraitType: "Portrait type",
    people: "People in the frame",
    medium: "Preferred medium",
    deadline: "Deadline",
    budget: "Budget",
    description: "What they'd like drawn",
    reference: "Reference",
    replyHint: "Reply directly to this email to reach"
  },

  /** Strings that only ever reach assistive tech. */
  a11y: {
    closeViewer: "Close image viewer",
    prevPortrait: "Previous portrait",
    nextPortrait: "Next portrait",
    openPortrait: "Open portrait",
    skipToContent: "Skip to content",
    motionReduce: "Reduce motion on this site",
    motionEnable: "Turn motion back on",
    openMenu: "Open menu",
    closeMenu: "Close menu"
  }
} as const;

export type GalleryItem = (typeof SITE.gallery.items)[number];
export type PricingTier = (typeof SITE.pricing.tiers)[number];
export type Review = (typeof SITE.reviews.items)[number];
