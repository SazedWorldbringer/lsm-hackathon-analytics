import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"
export const env = createEnv({
  server: {
    LANGFLOW_APPLICATION_TOKEN: z.string().min(1),
    LANGFLOW_FLOW_ID: z.string().min(1),
    LANGFLOW_ID: z.string().min(1),
  },
  runtimeEnv: {
    LANGFLOW_APPLICATION_TOKEN: process.env.LANGFLOW_APPLICATION_TOKEN,
    LANGFLOW_FLOW_ID: process.env.LANGFLOW_FLOW_ID,
    LANGFLOW_ID: process.env.LANGFLOW_ID,
  },
})
