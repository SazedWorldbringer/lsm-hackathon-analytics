import type { LangflowResponse, LangflowError, LangflowTweaks, StreamCallbacks } from '~/types/langflow';

export class LangflowClient {
  private baseURL;
  private applicationToken;

  constructor(baseURL: string, applicationToken: string) {
    this.baseURL = baseURL;
    this.applicationToken = applicationToken;
  }

  private async post<T>(
    endpoint: string,
    body: Record<string, unknown>,
    headers: Record<string, string> = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const requestHeaders = {
      'Authorization': `Bearer ${this.applicationToken}`,
      'Content-Type': 'application/json',
      ...headers,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(body),
      });

      console.log(response)
      const responseData = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          statusText: response.statusText,
          message: responseData,
        } as LangflowError;
      }

      return responseData as T;
    } catch (error) {
      console.error('Request Error:', error);
      throw error;
    }
  }

  private async initiateSession(
    flowId: string,
    langflowId: string,
    inputValue: string,
    inputType: string = 'chat',
    outputType: string = 'chat',
    stream: boolean = false,
    tweaks: LangflowTweaks = {}
  ): Promise<LangflowResponse> {
    const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
    return this.post<LangflowResponse>(endpoint, {
      input_value: inputValue,
      input_type: inputType,
      output_type: outputType,
      tweaks,
    });
  }

  private handleStream(
    streamUrl: string,
    { onUpdate, onClose, onError }: StreamCallbacks
  ): EventSource {
    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (typeof data === 'object' && data != null) {
          onUpdate?.({ chunk: String(data.chunk ?? '') });
        }
      } catch (error) {
        console.error('Error parsing stream data:', error);
        onError?.('Error parsing stream data');
      }
    };

    eventSource.onerror = (event) => {
      console.error('Stream Error:', event);
      onError?.(event);
      eventSource.close();
    };

    eventSource.addEventListener('close', () => {
      onClose?.('Stream closed');
      eventSource.close();
    });

    return eventSource;
  }

  public async runFlow(
    flowId: string,
    langflowId: string,
    inputValue: string,
    inputType: string = 'chat',
    outputType: string = 'chat',
    tweaks: LangflowTweaks = {},
    stream: boolean = false,
    callbacks?: StreamCallbacks
  ): Promise<LangflowResponse> {
    try {
      const response = await this.initiateSession(
        flowId,
        langflowId,
        inputValue,
        inputType,
        outputType,
        stream,
        tweaks
      );

      if (
        stream &&
        response?.outputs?.[0]?.outputs?.[0]?.artifacts?.stream_url &&
        callbacks
      ) {
        const streamUrl = response.outputs[0].outputs[0].artifacts.stream_url;
        console.log(`Streaming from: ${streamUrl}`);
        this.handleStream(streamUrl, callbacks);
      }

      return response;
    } catch (error) {
      console.error('Error running flow:', error);
      throw error;
    }
  }

  public extractMessage(response: LangflowResponse): string {
    try {
      return response.outputs[0]!.outputs[0]!.outputs.message.message.text;
    } catch (error) {
      console.error('Error extracting message:', error);
      throw new Error('Invalid response format');
    }
  }
}
