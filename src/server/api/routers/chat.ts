import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { LangflowClient } from "~/utils/langflow-client";

if (!env.LANGFLOW_APPLICATION_TOKEN) {
  throw new Error("LANGFLOW_APPLICATION_TOKEN is not set")
}
if (!env.LANGFLOW_FLOW_ID) {
  throw new Error("LANGFLOW_FLOW_ID is not set")
}
if (!env.LANGFLOW_ID) {
  throw new Error("LANGFLOW_ID is not set")
}

const langflowClient = new LangflowClient(
  "https://api.langflow.astra.datastax.com",
  env.LANGFLOW_APPLICATION_TOKEN
)

const MessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  stream: z.boolean().optional().default(false),
})

export const chatRouter = createTRPCRouter({
  sendMessage: publicProcedure
    .input(MessageSchema)
    .mutation(async ({ input }) => {
      try {
        const response = await langflowClient.runFlow(
          env.LANGFLOW_FLOW_ID,
          env.LANGFLOW_ID,
          input.message,
          'chat',
          'chat',
          {}, // tweaks
          input.stream
        );

        try {
          const message = langflowClient.extractMessage(response);
          return { message };
        } catch (error) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to parse Langflow response',
            cause: error,
          });
        }
      } catch (error) {
        console.error("Chat error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get response from Langflow',
          cause: error,
        });
      }
    }),
})
