const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

import { SalaryRequest, SalaryEntry, Option } from '../classes/types';

export async function fetchActivityForOccupation(code: string): Promise<string | null> {
  const res = await fetch(`${API_BASE_URL}/activity-from-occupation/${code}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.activityCode ?? null;
}

export async function fetchSalaryData(body: SalaryRequest): Promise<SalaryEntry[] | null> {
  const res = await fetch(`${API_BASE_URL}/salary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.salaryData ?? null;
}

export async function fetchSummary(salaryData: SalaryEntry[]): Promise<string | null> {
  const res = await fetch(`${API_BASE_URL}/api/summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: JSON.stringify(salaryData) }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.summary ?? null;
}

export async function fetchActivities(query: string): Promise<Option[]> {
  const res = await fetch(`${API_BASE_URL}/activities/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchOccupations(query: string): Promise<Option[]> {
  const res = await fetch(`${API_BASE_URL}/occupations/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  return res.json();
}