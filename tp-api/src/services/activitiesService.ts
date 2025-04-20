import axios from 'axios';

const METADATA_URL = 'https://andmed.stat.ee/api/v1/et/stat/PA103';

export interface ActivityOption {
  code: string;
  name: string;
}

export async function getActivityOptions(): Promise<ActivityOption[]> {
  const response = await axios.get(METADATA_URL);
  const variables = (response.data as { variables: any[] }).variables;

  const activityVar = variables.find((v: any) => v.code === 'Tegevusala');
  if (!activityVar) {
    throw new Error('Tegevusala ei leitud metadata vastusest');
  }

  const codes = activityVar.values;
  const names = activityVar.valueTexts;

  const options: ActivityOption[] = codes.map((code: string, i: number) => ({
    code,
    name: names[i],
  }));

  return options;
}

export async function fetchSalaryDataByGroupCode(groupCode: string): Promise<{ year: string; salary: number }[]> {
  const query = {
    query: [
      {
        code: 'Näitaja',
        selection: {
          filter: 'item',
          values: ['GR_W_AVG'], // Keskmine brutokuupalk
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

  const res = await axios.post(METADATA_URL, query, {
    headers: { 'Content-Type': 'application/json' },
  });

  const { value, dimension } = res.data;
  const periods = dimension['Vaatlusperiood'].category.index;
  const results: { year: string; salary: number }[] = [];

  Object.entries(periods).forEach(([key, idx]) => {
    const salaryValue = (value as number[])[Number(idx)];
    if (typeof salaryValue === 'number') {
      results.push({ year: key, salary: salaryValue });
    }
  });

  results.sort((a, b) => parseInt(a.year) - parseInt(b.year));

  return results;
}
