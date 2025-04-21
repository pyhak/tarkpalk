/**
 * ISCO -> EMTAK grupikoodide seosed.
 *
 * Toetab:
 * - täpsed vasted (ISCO täiskood → EMTAK tähetasand + 2 numbrit, nt '25120003' → 'J62')
 * - fallback: ISCO koodi järjest lühemate lõikude proovimine (nt '23410001' → '2341' → ...)
 * - fallback: ISCO 1. tase (nt '2' → 'P85')
 */

const occupationToActivityMap: Record<string, string> = {
    // IT
    '2512': 'J62',
    '2519': 'J62',
    '25120003': 'J62',
    '25120004': 'J62',
    '25190002': 'J62',
    '25120002': 'J62',
    '25129900': 'J62',
    '25199900': 'J62',
  
    // Transport
    '83320001': 'H49',
    '83220001': 'H49',
    '83410001': 'H49',
  
    // Põllumajandus
    '61130001': 'A01',
    '611': 'A01',
    '612': 'A01',
  
    // Ehitus
    '71150001': 'F41',
    '71110001': 'F41',
    '71260001': 'F43',
    '74110001': 'F43',
  
    // Müük ja teenindus
    '52230001': 'G47',
    '52420001': 'G47',
    '51310001': 'I55',
    '51320001': 'I56',
    '51200001': 'I56',
    '51410001': 'S96',
    '91120001': 'S96',
  
    // Kontoritöö ja haldus
    '41100001': 'N82',
    '33410001': 'O84',
    '43210001': 'H52',
  
    // Tervishoid
    '22210001': 'Q86',
    '22120001': 'Q86',
    '53210001': 'Q87',
  
    // Haridus
    '23410001': 'P85',
    '23300001': 'P85',
    '23510001': 'P85',
  
    // Õigus
    '26110001': 'O84',
  };
  
  const iscoTopLevelToEmtak: Record<string, string> = {
    '1': 'O84', // Juhid
    '2': 'P85', // Spetsialistid (nt õpetajad)
    '3': 'Q86', // Tervishoid
    '4': 'N82', // Kontoritöötajad
    '5': 'G47', // Teenindus- ja müügitöötajad
    '6': 'F41', // Oskustöölised, põllumajandus, ehitus
    '7': 'C33', // Käsitöölised, mehaanikud
    '8': 'J62', // Masinajuhid, transporditöötajad
    '9': 'S96', // Lihttöölised
  };
  
  export function mapOccupationToActivity(occupationCode: string): string | undefined {
    // 1. täpne vaste
    if (occupationCode in occupationToActivityMap) {
      return occupationToActivityMap[occupationCode];
    }
  
    // 2. fallback: proovi järjest lühemaid ISCO koode
    for (let i = occupationCode.length - 1; i >= 1; i--) {
      const partialCode = occupationCode.slice(0, i);
      if (partialCode in occupationToActivityMap) {
        return occupationToActivityMap[partialCode];
      }
    }
  
    // 3. fallback: ISCO 1. tase (nt '2' → 'P85')
    const topLevel = occupationCode.charAt(0);
    return iscoTopLevelToEmtak[topLevel];
  }
  
  export function hasMappedActivity(occupationCode: string): boolean {
    return !!mapOccupationToActivity(occupationCode);
  }