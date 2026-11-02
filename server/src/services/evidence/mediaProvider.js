// Provider boundary for future image/video integrations. This MVP never
// invents playable URLs or describes a static illustration as recorded media.
export const mediaProvider = {
  name: 'placeholder',
  async generateImage(input) { return { status: 'unavailable', representationType: 'illustration', description: input.description, assetId: null }; },
  async generateVideo() { return { status: 'unavailable', representationType: 'frame-sequence', assetId: null }; },
  async getAsset() { return null; },
  async deleteAsset() { return false; }
};
