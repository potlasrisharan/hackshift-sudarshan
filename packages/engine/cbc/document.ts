/** Check declared PNG/JPEG dimensions before allocating a decoded image bitmap. */
export function declaredImagePixels(bytes: Uint8Array): number {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (
    bytes[0] === 137 &&
    bytes[1] === 80 &&
    bytes[2] === 78 &&
    bytes[3] === 71
  ) {
    if (bytes.length < 24) throw new Error("Incomplete PNG header");
    const width = view.getUint32(16),
      height = view.getUint32(20);
    if (!width || !height) throw new Error("Invalid image dimensions");
    return width * height;
  }
  if (bytes[0] === 255 && bytes[1] === 216) {
    let offset = 2;
    while (offset + 3 < bytes.length) {
      if (bytes[offset] !== 255) break;
      while (bytes[offset] === 255) offset++;
      const marker = bytes[offset++];
      if (marker === undefined || marker === 217 || marker === 218) break;
      if (marker === 1 || (marker >= 208 && marker <= 215)) continue;
      if (offset + 2 > bytes.length) break;
      const length = view.getUint16(offset);
      if (length < 2 || offset + length > bytes.length) break;
      if (
        [
          192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207,
        ].includes(marker)
      ) {
        if (length < 7) break;
        const height = view.getUint16(offset + 3),
          width = view.getUint16(offset + 5);
        if (!width || !height) break;
        return width * height;
      }
      offset += length;
    }
  }
  throw new Error("Image dimensions could not be validated");
}
