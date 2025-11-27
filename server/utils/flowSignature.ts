import crypto from 'crypto';

/**
 * Flow API requires all parameters to be signed using HMAC-SHA256
 *
 * Process:
 * 1. Sort parameters alphabetically by key
 * 2. Concatenate as: "key1value1key2value2..."
 * 3. Generate HMAC-SHA256 signature
 * 4. Return signature as hex string
 */

export interface FlowParams {
  [key: string]: string | number;
}

export function generateFlowSignature(params: FlowParams, secretKey: string): string {
  // Remove signature parameter if exists (it shouldn't be signed)
  const paramsToSign = { ...params };
  delete paramsToSign.s;

  // Sort parameters alphabetically by key
  const sortedKeys = Object.keys(paramsToSign).sort();

  // Concatenate keys and values
  const concatenated = sortedKeys
    .map(key => `${key}${paramsToSign[key]}`)
    .join('');

  // Generate HMAC-SHA256 signature
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(concatenated)
    .digest('hex');

  return signature;
}

/**
 * Adds signature to params object
 */
export function signFlowParams(params: FlowParams, secretKey: string): FlowParams {
  const signature = generateFlowSignature(params, secretKey);
  return {
    ...params,
    s: signature
  };
}

/**
 * Verifies if a signature is valid
 */
export function verifyFlowSignature(params: FlowParams, secretKey: string): boolean {
  const receivedSignature = params.s;
  if (!receivedSignature) return false;

  const calculatedSignature = generateFlowSignature(params, secretKey);
  return receivedSignature === calculatedSignature;
}
