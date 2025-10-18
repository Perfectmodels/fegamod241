import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

// Initialize Convex client with deployment key
const convex = new ConvexHttpClient(import.meta.env.VITE_CONVEX_DEPLOY_KEY);

async function migrateData() {
  try {
    console.log("Starting data migration to Convex...");

    // Sample Members Data
    const membersData = [
      {
        name: "EYANG NDONG Dona Pascale",
        gender: "Féminin",
        email: "design.dona.pen@gmail.com",
        phone: "062391817",
        ageRange: "31-45 ans",
        nationality: "Gabon",
        city: "Libreville",
        association: "UCREATE",
        category: "Styliste & Modéliste",
        revenue: "Moins de 100 000 FCFA",
        bio: "Designer passionnée par la mode gabonaise.",
        imageUrl: "/logo.jpg",
        socials: { instagram: "@dona_design" },
      },
      {
        name: "Louis Parfait Nguema Asseko",
        gender: "Masculin",
        email: "Asseko19@gmail.com",
        phone: "074066461",
        ageRange: "21-30 ans",
        nationality: "Gabon",
        city: "Libreville",
        association: "PROMAGA",
        category: "Mannequin",
        revenue: "500 000 - 1 000 000 FCFA",
        bio: "Mannequin professionnel.",
        imageUrl: "/logo.jpg",
        socials: { instagram: "@louis_mannequin" },
      },
      // Add more members as needed (up to 135 from original data)
    ];

    // Sample Events Data
    const eventsData = [
      {
        title: "Fashion Week Gabon 2024",
        date: "2024-12-01",
        location: "Libreville",
        description: "Événement majeur de la mode gabonaise.",
        imageUrl: "/logo.jpg",
      },
    ];

    // Sample Articles Data
    const articlesData = [
      {
        title: "L'essor de la mode au Gabon",
        excerpt: "Découvrez comment la mode gabonaise évolue.",
        content: "Contenu complet de l'article...",
        imageUrl: "/logo.jpg",
        category: "Tendances",
        date: "2024-10-01",
      },
    ];

    // Sample Founders Data
    const foundersData = [
      {
        name: "Dona Pascale EYANG NDONG",
        title: "Présidente",
        imageUrl: "/logo.jpg",
      },
    ];

    // Sample Partners Data
    const partnersData = [
      {
        name: "Partenaire Exemple",
        logoUrl: "/logo.jpg",
      },
    ];

    // Sample Settings Data
    const settingsData = {
      email: "contact@fegamod.ga",
      phone: "+241 00 00 00 00",
      address: "Libreville, Gabon",
    };

    // Insert Members
    for (const member of membersData) {
      await convex.mutation(api.members.addMember, member);
    }
    console.log("Members migrated.");

    // Insert Events
    for (const event of eventsData) {
      await convex.mutation(api.members.addEvent, event);
    }
    console.log("Events migrated.");

    // Insert Articles
    for (const article of articlesData) {
      await convex.mutation(api.members.addArticle, article);
    }
    console.log("Articles migrated.");

    // Insert Founders
    for (const founder of foundersData) {
      await convex.mutation(api.members.addFounder, founder);
    }
    console.log("Founders migrated.");

    // Insert Partners
    for (const partner of partnersData) {
      await convex.mutation(api.members.addPartner, partner);
    }
    console.log("Partners migrated.");

    // Insert Settings
    await convex.mutation(api.members.updateSettings, settingsData);
    console.log("Settings migrated.");

    console.log("Data migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrateData();
