import fs from "fs/promises"; // NB! lubab await kasutada
import path from "path";

export interface IscoItem {
  code: string;
  value: string;
  level: string;
  parentCode?: string;
}

let iscoList: IscoItem[] | null = null;

export async function loadIscoData(): Promise<void> {
  if (iscoList !== null) return;

  const filePath = path.join(__dirname, "../../data/occupations.json");
  const rawText = await fs.readFile(filePath, "utf-8");
  const parsed = JSON.parse(rawText);

  const items = parsed.Items;
  if (!Array.isArray(items)) {
    throw new Error("ISO klassifikaatori fail on vigane");
  }

  iscoList = items
    .filter((item: any) => item.Code)
    .map((item: any) => ({
      code: item.Code,
      value: item.Label?.["et-EE"] ?? "(nimetu)",
      level: item.ItemLevel,
      parentCode: item.ParentItem?.Code ?? undefined,
    }));

  console.log(`Laaditi ${iscoList.length} ISCO ametit`);
}

export function getAllIscoItems(): IscoItem[] {
  if (!iscoList) {
    throw new Error("ISCO andmed pole veel laetud. Käivita loadIscoData() kõigepealt.");
  }
  return iscoList;
}

export function findIscoItemByCode(code: string): IscoItem | undefined {
  if (!iscoList) {
    throw new Error("ISCO andmed pole veel laetud. Käivita loadIscoData() kõigepealt.");
  }
  return iscoList.find((i) => i.code === code);
}

export function findGroupCodeFor(code: string, fallbackLevels: string[] = ["4", "3"]): string | null {
  let item = findIscoItemByCode(code);
  while (item) {
    if (fallbackLevels.includes(item.level)) return item.code;
    if (!item.parentCode) break;
    item = findIscoItemByCode(item.parentCode);
  }
  return null;
}
