import {createHmac, timingSafeEqual} from 'node:crypto';
export const cookieName = 'nrth-preview';
const secret = () => process.env.CMS_PREVIEW_SECRET || import.meta.env.CMS_PREVIEW_SECRET || '';
export function equalSecret(value: string, expected = secret()) {const a = Buffer.from(value), b = Buffer.from(expected); return Boolean(b.length) && a.length === b.length && timingSafeEqual(a,b);}
export function createPreviewSession() {const expires = String(Date.now() + 3600000); return expires + '.' + createHmac('sha256',secret()).update(expires).digest('hex');}
export function validPreviewSession(value?: string) {
  if (!value || !secret()) return false;
  const [expires, signature] = value.split('.');
  if (!/^\d+$/.test(expires) || Number(expires) < Date.now() || Number(expires) > Date.now() + 3600000) return false;
  return equalSecret(signature || '', createHmac('sha256',secret()).update(expires).digest('hex'));
}
