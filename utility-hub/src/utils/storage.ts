import type { Config } from '@/types/config';

const STORAGE_SOURCE = process.env.STORAGE_SOURCE || 'mock';
const BLOB_URL = process.env.BLOB_URL;
const BLOB_TOKEN = process.env.BLOB_TOKEN;

const MOCK_PATH = process.env.MOCK_PATH || 'src/mock/app-config.json';

async function fetchBlobConfig(): Promise<Config> {
  if (!BLOB_URL || !BLOB_TOKEN) throw new Error('Blob storage config missing');
  const res = await fetch(BLOB_URL, {
    headers: { Authorization: `Bearer ${BLOB_TOKEN}` },
  });
  if (!res.ok) throw new Error('Failed to fetch blob config');
  return res.json();
}

async function writeBlobConfig(config: Config): Promise<void> {
  if (!BLOB_URL || !BLOB_TOKEN) throw new Error('Blob storage config missing');
  const res = await fetch(BLOB_URL, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${BLOB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error('Failed to write blob config');
}

import fs from 'fs/promises';

async function fetchMockConfig(): Promise<Config> {
  const data = await fs.readFile(MOCK_PATH, 'utf-8');
  return JSON.parse(data);
}

async function writeMockConfig(config: Config): Promise<void> {
  await fs.writeFile(MOCK_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

export async function getConfig(): Promise<Config> {
  if (STORAGE_SOURCE === 'blob') return fetchBlobConfig();
  return fetchMockConfig();
}

export async function setConfig(config: Config): Promise<void> {
  if (STORAGE_SOURCE === 'blob') return writeBlobConfig(config);
  return writeMockConfig(config);
}
