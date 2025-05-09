// List of official Nepali holidays
export const nepaliHolidays = [
  "Nepali New Year/Mesh Sankranti/Biska Jatra",
  "International Labour Day/Bungadyo : Rato Matsyandranath Rath Yatra Prambha",
  "Provincial Government Official Language Day/Kirat Samaj Sudhar Diwas",
  "Buddha Jayanti/Ubhauli Parwa/Chandeshwari Jatra/Chandi Poornima/Kurma Jayanti/Gorakhnath Jayanti/Poornima Vrata/Baisakh Snan Samapti/International Nurses Day",
  "Gantantra Diwas",
  "Janai Poornima/Rakshya Bandhan/Kwati Khane Din/Poornima Vrata/Rishi Tarpani/Sanskrit Diwas",
  "Gaijatra/International Day of the World's Indigenous Peoples",
  "Shree Krishna Janmashtami/Gorakhkali Puja",
  "Haritalika Teej",
  "Radha Janmotsav/Gaura Parva/Gorakhkali Puja/Durwashtami",
  "Indra Jaatra/Ananta Chaturdashi Vrata",
  "Nawami Shraddha/Jitiya Parva",
  "Trayodashi Shraddha/Magha Shraddha/Sambidhan Diwas",
  "Ghatasthaapana Vrata/Navaraatra Arambha",
  "Fulpati/World Heart Day",
  "Maha Ashtami Vrata/Kalratri/Gorakhkali Puja/Bhaumashtami Vrata",
  "Maha Nawami Vrata/International Day of Older Persons",
  "Bijaya Dashami/Devi Bisharjan/World Non Violence Day",
  "Papakunsa Ekadashi Vrata/World Smile Day",
  "Dashain Holiday/Shani Pradosh Vrata/World Animal Day",
  "Laxmi Pooja/Laxmi Prasad Devkota Janma Jayanti/Kukur Tihar/Narak Chaturdashi/Sukha Ratri",
  "Tihar Holiday",
  "Gobardan Puja/Gaigoru Puja/Mha Puja/Hali Tihar/Nepal Sambat 1145 Starts",
  "Bhai TIka/Kija Pooja",
  "Tihar Holiday/UN day/World Development Information Day",
  "Chhath Parva",
  "Poornima Vrata/Chaturmas Wrata Samapti/ Kartik Snan Samapti/Guru Nanak Jayanti",
  "Falgunanda Jayanti",
  "International Day of Disabled Persons",
  "Poornima Vrata/Dhanya Poornima/Yomari Punhi/Jyapu Diwas",
  "Christmas",
  "Tamu Lhosar/Kavi Siromani Lekhnath Jayanti/Putrada Ekadashi Vrata",
  "Prithivi Jayanti / Rashtriya Ekata Diwas/Gorakhkali Puja",
  "Makar Sankranti/Ghiu chaku khane Din/Uttarayan Arambha",
  "Sonam Lhochhar/Shree Ballav Jayanti",
  "Basanta Panchami vrata/Saraswati Pooja",
  "Sahid Diwas/Pradosh Vrata",
  "Maha-Shivaratri / Army Day/Silachahre Puja",
  "Gyalpo Lhosar",
  "Prajatantra Diwas / Election Day",
  "Fagu Poornima / Holi/Poornima Vrata",
  "Fagu Poornima (Terai)/Khandagras Chandra Grahan/World Wildlife Day",
  "International Womens Day",
  "Ghode Jaatra",
  "Shree Ram Nawami Vrata/World Theater Day"
];

// Function to check if an event is a holiday
export function isHolidayEvent(event: string): boolean {
  // Check if any holiday contains this event or vice versa
  for (const holiday of nepaliHolidays) {
    const holidayParts = holiday.split('/');
    
    // Check if any of the holiday parts match the event
    for (const part of holidayParts) {
      if (event.includes(part.trim()) || part.trim().includes(event)) {
        return true;
      }
    }
  }
  
  // Known holiday names that might appear in events
  const holidayKeywords = [
    "बिदा", "विदा", "छुट्टी", "जात्रा", "holiday", "dashain", "tihar", "chhath", 
    "lhosar", "new year", "नयाँ वर्ष", "सार्वजनिक", "public"
  ];
  
  // Check for holiday keywords
  for (const keyword of holidayKeywords) {
    if (event.toLowerCase().includes(keyword.toLowerCase())) {
      return true;
    }
  }
  
  return false;
}