import axios from 'axios';
import { STAT_API_BASE } from '../config';

export interface ActivityOption {
  code: string;
  name: string;
}

export async function getActivityOptions(): Promise<ActivityOption[]> {
  const response = await axios.get(STAT_API_BASE);
  type Variable = { code: string; values: string[]; valueTexts: string[] };

  const variables = (response.data as { variables: Variable[] }).variables;

  

  const activityVar = variables.find((v: Variable) => v.code === 'Tegevusala');
  if (!activityVar) {
    throw new Error('Tegevusala ei leitud metadata vastusest');
  }

  const codes = activityVar.values;
  const names = activityVar.valueTexts;

  return codes.map((code: string, i: number) => ({
    code,
    name: names[i],
  }));
}

export async function fetchSalaryDataByGroupCode(
  groupCode: string
): Promise<{ year: string; salary: number }[]> {
  const query = {
    query: [
      {
        code: 'Näitaja',
        selection: {
          filter: 'item',
          values: ['GR_W_AVG'],
        },
      },
      {
        code: 'Tegevusala',
        selection: {
          filter: 'item',
          values: [groupCode],
        },
      },
    ],
    response: {
      format: 'json-stat2',
    },
  };

  const res = await axios.post(STAT_API_BASE, query, {
    headers: { 'Content-Type': 'application/json' },
  });

  const { value, dimension } = res.data;
  const periods = dimension['Vaatlusperiood'].category.index;

  return Object.entries(periods)
    .map(([year, idx]) => {
      const val = (value as number[])[Number(idx)];
      return typeof val === 'number' ? { year, salary: val } : null;
    })
    .filter(Boolean) as { year: string; salary: number }[];
}
