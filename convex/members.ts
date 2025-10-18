import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getMembers = query({
  handler: async (ctx) => {
    return await ctx.db.query("members").collect();
  },
});

export const getMemberById = query({
  args: { id: v.id("members") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const addMember = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("members", args);
  },
});

export const updateMember = mutation({
  args: {
    id: v.id("members"),
    name: v.optional(v.string()),
    gender: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    ageRange: v.optional(v.string()),
    nationality: v.optional(v.string()),
    city: v.optional(v.string()),
    association: v.optional(v.string()),
    category: v.optional(v.string()),
    revenue: v.optional(v.string()),
    bio: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    socials: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteMember = mutation({
  args: { id: v.id("members") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Events
export const getEvents = query({
  handler: async (ctx) => {
    return await ctx.db.query("events").collect();
  },
});

export const addEvent = mutation({
  args: {
    title: v.string(),
    date: v.string(),
    location: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("events", args);
  },
});

export const updateEvent = mutation({
  args: {
    id: v.id("events"),
    title: v.optional(v.string()),
    date: v.optional(v.string()),
    location: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteEvent = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Articles
export const getArticles = query({
  handler: async (ctx) => {
    return await ctx.db.query("articles").collect();
  },
});

export const addArticle = mutation({
  args: {
    title: v.string(),
    excerpt: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    category: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("articles", args);
  },
});

export const updateArticle = mutation({
  args: {
    id: v.id("articles"),
    title: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    category: v.optional(v.string()),
    date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteArticle = mutation({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Founders
export const getFounders = query({
  handler: async (ctx) => {
    return await ctx.db.query("founders").collect();
  },
});

export const addFounder = mutation({
  args: {
    name: v.string(),
    title: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("founders", args);
  },
});

export const updateFounder = mutation({
  args: {
    id: v.id("founders"),
    name: v.optional(v.string()),
    title: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteFounder = mutation({
  args: { id: v.id("founders") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Partners
export const getPartners = query({
  handler: async (ctx) => {
    return await ctx.db.query("partners").collect();
  },
});

export const addPartner = mutation({
  args: {
    name: v.string(),
    logoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("partners", args);
  },
});

export const updatePartner = mutation({
  args: {
    id: v.id("partners"),
    name: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deletePartner = mutation({
  args: { id: v.id("partners") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Settings
export const getSettings = query({
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").collect();
    return settings[0] || null;
  },
});

// Users
export const getUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("users").filter((q) => q.eq(q.field("email"), args.email)).first();
  },
});

export const addUser = mutation({
  args: {
    email: v.string(),
    role: v.union(v.literal("Présidente"), v.literal("Secrétaire Général"), v.literal("Relations Publiques"), v.literal("Trésorerie"), v.literal("Admin")),
    name: v.string(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", args);
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    email: v.optional(v.string()),
    role: v.optional(v.union(v.literal("Présidente"), v.literal("Secrétaire Général"), v.literal("Relations Publiques"), v.literal("Trésorerie"), v.literal("Admin"))),
    name: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const deleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const addSettings = mutation({
  args: {
    email: v.string(),
    phone: v.string(),
    address: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if settings already exist
    const existingSettings = await ctx.db.query("settings").collect();
    if (existingSettings.length > 0) {
      throw new Error("Settings already exist. Use updateSettings instead.");
    }
    return await ctx.db.insert("settings", args);
  },
});

export const updateSettings = mutation({
  args: {
    id: v.optional(v.id("settings")),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    if (id) {
      // Update specific settings by ID
      return await ctx.db.patch(id, updates);
    } else {
      // Update the first (and should be only) settings document
      const existingSettings = await ctx.db.query("settings").collect();
      if (existingSettings.length === 0) {
        throw new Error("No settings found. Use addSettings first.");
      }
      return await ctx.db.patch(existingSettings[0]._id, updates);
    }
  },
});


