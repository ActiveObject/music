export const MEDIA_ERR_ABORTED = 1;
export const MEDIA_ERR_NETWORK = 2;
export const MEDIA_ERR_DECODE = 3;
export const MEDIA_ERR_SRC_NOT_SUPPORTED = 4;

export function showMediaError(code) {
  switch (code) {
    case MEDIA_ERR_ABORTED: return 'Fetching process aborted by user (MediaError, MEDIA_ERR_ABORTED)';
    case MEDIA_ERR_NETWORK: return 'Error occurred when downloading (MediaError, MEDIA_ERR_NETWORK)';
    case MEDIA_ERR_DECODE: return 'Error occurred when decoding (MediaError, MEDIA_ERR_DECODE)';
    case MEDIA_ERR_SRC_NOT_SUPPORTED: return 'Audio/video not supported (MediaError, MEDIA_ERR_SRC_NOT_SUPPORTED)';
  }

  throw new TypeError(
    `Unsupported MediaError code - ${code}` +
    `Supported MediaError codes: ${[MEDIA_ERR_ABORTED, MEDIA_ERR_NETWORK, MEDIA_ERR_DECODE, MEDIA_ERR_SRC_NOT_SUPPORTED].join(', ')}`
  );
}
