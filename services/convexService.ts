import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

// Custom hooks for Convex data
export const useMembers = () => {
  return useQuery(api.members.getMembers);
};

export const useMemberById = (id: string) => {
  return useQuery(api.members.getMemberById, { id });
};

export const useAddMember = () => {
  return useMutation(api.members.addMember);
};

export const useUpdateMember = () => {
  return useMutation(api.members.updateMember);
};

export const useDeleteMember = () => {
  return useMutation(api.members.deleteMember);
};

export const useEvents = () => {
  return useQuery(api.members.getEvents);
};

export const useAddEvent = () => {
  return useMutation(api.members.addEvent);
};

export const useUpdateEvent = () => {
  return useMutation(api.members.updateEvent);
};

export const useDeleteEvent = () => {
  return useMutation(api.members.deleteEvent);
};

export const useArticles = () => {
  return useQuery(api.members.getArticles);
};

export const useAddArticle = () => {
  return useMutation(api.members.addArticle);
};

export const useUpdateArticle = () => {
  return useMutation(api.members.updateArticle);
};

export const useDeleteArticle = () => {
  return useMutation(api.members.deleteArticle);
};

export const useFounders = () => {
  return useQuery(api.members.getFounders);
};

export const useAddFounder = () => {
  return useMutation(api.members.addFounder);
};

export const useUpdateFounder = () => {
  return useMutation(api.members.updateFounder);
};

export const useDeleteFounder = () => {
  return useMutation(api.members.deleteFounder);
};

export const usePartners = () => {
  return useQuery(api.members.getPartners);
};

export const useAddPartner = () => {
  return useMutation(api.members.addPartner);
};

export const useUpdatePartner = () => {
  return useMutation(api.members.updatePartner);
};

export const useDeletePartner = () => {
  return useMutation(api.members.deletePartner);
};

export const useSettings = () => {
  return useQuery(api.members.getSettings);
};

export const useUsers = () => {
  return useQuery(api.members.getUsers);
};

export const useUserByEmail = (email: string) => {
  return useQuery(api.members.getUserByEmail, { email });
};

export const useAddUser = () => {
  return useMutation(api.members.addUser);
};

export const useUpdateUser = () => {
  return useMutation(api.members.updateUser);
};

export const useDeleteUser = () => {
  return useMutation(api.members.deleteUser);
};

export const useCurrentUserRole = () => {
  const users = useQuery(api.members.getUsers);
  // For demo purposes, assume the first user. In production, integrate with auth.
  return users?.[0]?.role || null;
};
