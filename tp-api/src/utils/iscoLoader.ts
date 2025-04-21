import fs from 'fs/promises';
import path from 'path';

export class IscoNode {
  constructor(
    public code: string,
    public name: string,
    public level: string,
    public parentCode?: string,
    public parentName?: string
  ) {}

  get label(): string {
    return this.name;
  }

  get category(): string {
    return this.parentName || this.name;
  }
}

let iscoList: IscoNode[] | null = null;

export async function loadIscoData(): Promise<void> {
  if (iscoList !== null) return;

  const filePath = path.join(__dirname, '../../data/occupations.json');
  const rawText = await fs.readFile(filePath, 'utf-8');
  const parsed = JSON.parse(rawText);

  const items = parsed.Items;
  if (!Array.isArray(items)) {
    throw new Error('ISCO klassifikaatori fail on vigane');
  }

  const allNodes: IscoNode[] = items
    .filter((item: any) => item.Code)
    .map(
      (item: any) =>
        new IscoNode(
          item.Code,
          item.Label?.['et-EE'] ?? '(nimetu)',
          item.ItemLevel,
          item.ParentItem?.Code ?? undefined
        )
    );

  // leia level 3 parentid kategooria määramiseks (level 4 ja 5 jaoks)
  for (const node of allNodes) {
    if (!['4', '5'].includes(node.level)) continue;

    let parent = allNodes.find((p) => p.code === node.parentCode);
    while (parent && parent.level !== '3') {
      parent = allNodes.find((p) => p.code === parent?.parentCode);
    }

    if (parent) {
      node.parentName = parent.name;
    }
  }

  iscoList = allNodes;
  console.log(`Laaditi ${iscoList.length} ISCO ametit`);
}

export function getAllIscoItems(): IscoNode[] {
  if (!iscoList) {
    throw new Error('ISCO andmed pole veel laetud. Käivita loadIscoData() kõigepealt.');
  }
  return iscoList;
}

export function findIscoItemByCode(code: string): IscoNode | undefined {
  if (!iscoList) {
    throw new Error('ISCO andmed pole veel laetud. Käivita loadIscoData() kõigepealt.');
  }
  return iscoList.find((i) => i.code === code);
}

export function findGroupCodeFor(code: string, targetLevels: string[] = ['4', '3']): string | null {
  if (!iscoList) {
    throw new Error('ISCO andmed pole veel laetud.');
  }

  let current = findIscoItemByCode(code);

  while (current) {
    if (targetLevels.includes(current.level)) {
      return current.code;
    }
    if (!current.parentCode) break;
    current = findIscoItemByCode(current.parentCode);
  }

  return null;
}