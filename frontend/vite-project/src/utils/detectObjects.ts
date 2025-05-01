export type DetectionResult = {
    label: string;
    confidence: number;
  };
  
  /**
   * Mock browser-based object detection function.
   * Replace this with WASM-based model inference logic later.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export async function detectObjects(image: HTMLImageElement): Promise<DetectionResult[]> {

    await new Promise(resolve => setTimeout(resolve, 50)); // simulate latency
  
    // Randomly simulate detection of person/car
    const mockResults: DetectionResult[] = [];
    if (Math.random() > 0.4) mockResults.push({ label: 'person', confidence: 0.92 });
    if (Math.random() > 0.6) mockResults.push({ label: 'car', confidence: 0.88 });
  
    return mockResults;
  }
  