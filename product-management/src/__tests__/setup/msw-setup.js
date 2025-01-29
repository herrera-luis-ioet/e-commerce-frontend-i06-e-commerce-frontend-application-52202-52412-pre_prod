import { ReadableStream, TransformStream } from 'web-streams-polyfill';

// Mock BroadcastChannel
class MockBroadcastChannel {
  constructor() {
    this.name = 'mock-broadcast-channel';
  }
  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
}

// Add required globals
global.ReadableStream = ReadableStream;
global.TransformStream = TransformStream;
global.BroadcastChannel = MockBroadcastChannel;

// Export for use in other files
export { ReadableStream, TransformStream };
