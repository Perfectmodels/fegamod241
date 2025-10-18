import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  members: defineTable({
    name: v.string(),
    gender: v.string(),
    email: v.string(),
    phone: v.string(),
    ageRange: v.string(),
    nationality: v.string(),
    city: v.string(),
    association: v.string(),
    category: v.string(),
    revenue: v.string(),
    bio: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    socials: v.optional(v.any()),
  }).index("by_name", ["name"]),
  events: defineTable({
    title: v.string(),
    date: v.string(),
    location: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
  }).index("by_date", ["date"]),
  articles: defineTable({
    title: v.string(),
    excerpt: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    category: v.string(),
    date: v.string(),
  }).index("by_date", ["date"]),
  founders: defineTable({
    name: v.string(),
    title: v.string(),
    imageUrl: v.optional(v.string()),
  }).index("by_name", ["name"]),
  partners: defineTable({
    name: v.string(),
    logoUrl: v.optional(v.string()),
  }).index("by_name", ["name"]),
  settings: defineTable({
    email: v.string(),
    phone: v.string(),
    address: v.string(),
  }),
  users: defineTable({
    email: v.string(),
    role: v.union(v.literal("Présidente"), v.literal("Secrétaire Général"), v.literal("Relations Publiques"), v.literal("Trésorerie"), v.literal("Admin")),
    name: v.string(),
    isActive: v.boolean(),
  }).index("by_email", ["email"]),
});
