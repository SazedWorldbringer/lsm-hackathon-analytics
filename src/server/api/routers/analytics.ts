import { analyzeSocialMediaData } from "~/utils/astradb-connection";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const analyticsRouter = createTRPCRouter({
  getAnalytics: publicProcedure
    .query(async () => {
      const { allPosts, analytics } = await analyzeSocialMediaData()
      return { allPosts, analytics }
    })
})
