export type LangflowResponse = {
  outputs: Array<{
    outputs: Array<{
      outputs: {
        message: {
          message: {
            text: string;
          };
        };
      };
      artifacts?: {
        stream_url?: string;
      };
    }>;
  }>;
};

export type LangflowError = {
  status: number;
  statusText: string;
  message: string;
};

export type LangflowTweaks = {
  [key: string]: Record<string, unknown>;
};

export type StreamCallbacks = {
  onUpdate?: (data: { chunk: string }) => void;
  onClose?: (message: string) => void;
  onError?: (error: Event | string) => void;
};
