// src/utils/occupationToActivityMapper.ts

/**
 * Kõva koodiga ISCO -> EMTAK grupikoodide seosed.
 * Kasutatakse olukorras, kus amet (ISCO) tuleb konverteerida tegevusalaks (EMTAK),
 * et teha päring palgastatistika API vastu.
 */

const occupationToActivityMap: Record<string, string> = {
    // IT
    '25120003': 'J62', // Tarkvaraarendaja
    '25120004': 'J62', // Tarkvarainsener
    '25190002': 'J62', // Tarkvara testija
    '25120002': 'J62', // Tarkvaradisainer
    '25129900': 'J62', // Mujal liigitamata tarkvaraarendajad
    '25199900': 'J62', // Muud mujal liigitamata tarkvara ja rakenduste arendajad
  
    // Transport
    '83320001': 'H49', // Bussijuht
    '83220001': 'H49', // Veoautojuht
    '83410001': 'H49', // Taksojuht
  
    // Põllumajandus
    '61130001': 'A01', // Aednik
    '611': 'A01',      // Taimekasvatuse oskustöölised
    '612': 'A01',      // Loomakasvatuse oskustöölised
  
    // Ehitus
    '71150001': 'F41', // Ehituspuusepp
    '71110001': 'F41', // Müüritööline
    '71260001': 'F43', // Torulukksepp
    '74110001': 'F43', // Elektrik
  
    // Müük ja teenindus
    '52230001': 'G47', // Klienditeenindaja
    '52420001': 'G47', // Kassapidaja
    '51310001': 'I55', // Hotellivastuvõtutöötaja
    '51320001': 'I56', // Ettekandja
    '51200001': 'I56', // Kokk
    '51410001': 'S96', // Juuksur
    '91120001': 'S96', // Koristaja
  
    // Kontoritöö ja haldus
    '41100001': 'N82', // Kontoritöötaja
    '33410001': 'O84', // Sekretär
    '43210001': 'H52', // Laotöötaja
  
    // Tervishoid
    '22210001': 'Q86', // Õde
    '22120001': 'Q86', // Arst
    '53210001': 'Q87', // Hooldustöötaja
  
    // Haridus
    '23410001': 'P85', // Alushariduse õpetaja
    '23300001': 'P85', // Põhikooli õpetaja
    '23510001': 'P85', // Keskkooli õpetaja
  
    // Õigus
    '26110001': 'O84', // Jurist
  };
  
  export function mapOccupationToActivity(occupationCode: string): string | undefined {
    return occupationToActivityMap[occupationCode];
  }
  
  export function hasMappedActivity(occupationCode: string): boolean {
    return occupationCode in occupationToActivityMap;
  }
  