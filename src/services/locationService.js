// Service for fetching Philippines location data from external APIs
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const API_BASE_URL = 'https://psgc.gitlab.io/api';

class LocationService {
  constructor() {
    this.cache = new Map();
  }

  // Generic cache management
  async getCachedData(key) {
    try {
      const cached = await AsyncStorage.getItem(`location_${key}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }
    return null;
  }

  async setCachedData(key, data) {
    try {
      const cacheItem = {
        data,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem(`location_${key}`, JSON.stringify(cacheItem));
    } catch (error) {
      console.warn('Cache write error:', error);
    }
  }

  // Fetch regions
  async getRegions() {
    const cacheKey = 'regions';
    let cached = await this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${API_BASE_URL}/regions`);
      if (!response.ok) throw new Error('Failed to fetch regions');
      
      const data = await response.json();
      const formatted = data.map(region => ({
        value: region.code,
        label: region.name,
        code: region.code
      })).sort((a, b) => a.label.localeCompare(b.label));

      await this.setCachedData(cacheKey, formatted);
      return formatted;
    } catch (error) {
      console.error('Error fetching regions:', error);
      return this.getFallbackRegions();
    }
  }

  // Fetch provinces by region
  async getProvinces(regionCode) {
    if (!regionCode) return [];
    
    const cacheKey = `provinces_${regionCode}`;
    let cached = await this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${API_BASE_URL}/regions/${regionCode}/provinces`);
      if (!response.ok) throw new Error('Failed to fetch provinces');
      
      const data = await response.json();
      const formatted = data.map(province => ({
        value: province.code,
        label: province.name,
        code: province.code
      })).sort((a, b) => a.label.localeCompare(b.label));

      await this.setCachedData(cacheKey, formatted);
      return formatted;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      return this.getFallbackProvinces(regionCode);
    }
  }

  // Fetch cities/municipalities by province
  async getCities(provinceCode) {
    if (!provinceCode) return [];
    
    const cacheKey = `cities_${provinceCode}`;
    let cached = await this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${API_BASE_URL}/provinces/${provinceCode}/cities-municipalities`);
      if (!response.ok) throw new Error('Failed to fetch cities');
      
      const data = await response.json();
      const formatted = data.map(city => ({
        value: city.code,
        label: city.name,
        code: city.code,
        isCity: city.isCity
      })).sort((a, b) => a.label.localeCompare(b.label));

      await this.setCachedData(cacheKey, formatted);
      return formatted;
    } catch (error) {
      console.error('Error fetching cities:', error);
      return this.getFallbackCities(provinceCode);
    }
  }

  // Fetch barangays by city/municipality
  async getBarangays(cityCode) {
    if (!cityCode) return [];
    
    const cacheKey = `barangays_${cityCode}`;
    let cached = await this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${API_BASE_URL}/cities-municipalities/${cityCode}/barangays`);
      if (!response.ok) throw new Error('Failed to fetch barangays');
      
      const data = await response.json();
      const formatted = data.map(barangay => ({
        value: barangay.code,
        label: barangay.name,
        code: barangay.code
      })).sort((a, b) => a.label.localeCompare(b.label));

      await this.setCachedData(cacheKey, formatted);
      return formatted;
    } catch (error) {
      console.error('Error fetching barangays:', error);
      return this.getFallbackBarangays(cityCode);
    }
  }

  // Fallback data for offline scenarios
  getFallbackRegions() {
    return [
      { value: '130000000', label: 'National Capital Region (NCR)', code: '130000000' },
      { value: '010000000', label: 'Region I - Ilocos Region', code: '010000000' },
      { value: '020000000', label: 'Region II - Cagayan Valley', code: '020000000' },
      { value: '030000000', label: 'Region III - Central Luzon', code: '030000000' },
      { value: '040000000', label: 'Region IV-A - CALABARZON', code: '040000000' },
      { value: '170000000', label: 'Region IV-B - MIMAROPA', code: '170000000' },
      { value: '050000000', label: 'Region V - Bicol Region', code: '050000000' },
      { value: '060000000', label: 'Region VI - Western Visayas', code: '060000000' },
      { value: '070000000', label: 'Region VII - Central Visayas', code: '070000000' },
      { value: '080000000', label: 'Region VIII - Eastern Visayas', code: '080000000' },
      { value: '090000000', label: 'Region IX - Zamboanga Peninsula', code: '090000000' },
      { value: '100000000', label: 'Region X - Northern Mindanao', code: '100000000' },
      { value: '110000000', label: 'Region XI - Davao Region', code: '110000000' },
      { value: '120000000', label: 'Region XII - SOCCSKSARGEN', code: '120000000' },
      { value: '160000000', label: 'Region XIII - Caraga', code: '160000000' },
      { value: '150000000', label: 'Cordillera Administrative Region (CAR)', code: '150000000' },
      { value: '190000000', label: 'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)', code: '190000000' },
    ];
  }

  getFallbackProvinces(regionCode) {
    const fallbackData = {
      '130000000': [ // NCR
        { value: '1300000000', label: 'Metro Manila', code: '1300000000' }
      ],
      '030000000': [ // Region III
        { value: '0308000000', label: 'Bataan', code: '0308000000' },
        { value: '0314000000', label: 'Bulacan', code: '0314000000' },
        { value: '0349000000', label: 'Nueva Ecija', code: '0349000000' },
        { value: '0354000000', label: 'Pampanga', code: '0354000000' },
        { value: '0369000000', label: 'Tarlac', code: '0369000000' },
        { value: '0371000000', label: 'Zambales', code: '0371000000' },
      ],
      '040000000': [ // CALABARZON
        { value: '0410000000', label: 'Batangas', code: '0410000000' },
        { value: '0421000000', label: 'Cavite', code: '0421000000' },
        { value: '0434000000', label: 'Laguna', code: '0434000000' },
        { value: '0456000000', label: 'Quezon', code: '0456000000' },
        { value: '0458000000', label: 'Rizal', code: '0458000000' },
      ]
    };
    return fallbackData[regionCode] || [];
  }

  getFallbackCities(provinceCode) {
    const fallbackData = {
      '1300000000': [ // Metro Manila
        { value: '137404000', label: 'Caloocan City', code: '137404000', isCity: true },
        { value: '137405000', label: 'Las Piñas City', code: '137405000', isCity: true },
        { value: '137406000', label: 'Makati City', code: '137406000', isCity: true },
        { value: '137407000', label: 'Malabon City', code: '137407000', isCity: true },
        { value: '137408000', label: 'Mandaluyong City', code: '137408000', isCity: true },
        { value: '137409000', label: 'Manila City', code: '137409000', isCity: true },
        { value: '137410000', label: 'Marikina City', code: '137410000', isCity: true },
        { value: '137411000', label: 'Muntinlupa City', code: '137411000', isCity: true },
        { value: '137412000', label: 'Navotas City', code: '137412000', isCity: true },
        { value: '137413000', label: 'Parañaque City', code: '137413000', isCity: true },
        { value: '137414000', label: 'Pasay City', code: '137414000', isCity: true },
        { value: '137415000', label: 'Pasig City', code: '137415000', isCity: true },
        { value: '137416000', label: 'Pateros Municipality', code: '137416000', isCity: false },
        { value: '137417000', label: 'Quezon City', code: '137417000', isCity: true },
        { value: '137418000', label: 'San Juan City', code: '137418000', isCity: true },
        { value: '137419000', label: 'Taguig City', code: '137419000', isCity: true },
        { value: '137420000', label: 'Valenzuela City', code: '137420000', isCity: true },
      ]
    };
    return fallbackData[provinceCode] || [];
  }

  getFallbackBarangays(cityCode) {
    const fallbackData = {
      '137417000': [ // Quezon City
        { value: '137417001', label: 'Bagong Pag-asa', code: '137417001' },
        { value: '137417002', label: 'Bahay Toro', code: '137417002' },
        { value: '137417003', label: 'Balingasa', code: '137417003' },
        { value: '137417004', label: 'Commonwealth', code: '137417004' },
        { value: '137417005', label: 'Culiat', code: '137417005' },
        { value: '137417006', label: 'Diliman', code: '137417006' },
        { value: '137417007', label: 'Fairview', code: '137417007' },
        { value: '137417008', label: 'Holy Spirit', code: '137417008' },
        { value: '137417009', label: 'Kamuning', code: '137417009' },
        { value: '137417010', label: 'Loyola Heights', code: '137417010' },
        { value: '137417011', label: 'Novaliches', code: '137417011' },
        { value: '137417012', label: 'Project 6', code: '137417012' },
        { value: '137417013', label: 'Project 8', code: '137417013' },
        { value: '137417014', label: 'Tandang Sora', code: '137417014' },
        { value: '137417015', label: 'U.P. Campus', code: '137417015' },
      ],
      '137409000': [ // Manila
        { value: '137409001', label: 'Binondo', code: '137409001' },
        { value: '137409002', label: 'Ermita', code: '137409002' },
        { value: '137409003', label: 'Intramuros', code: '137409003' },
        { value: '137409004', label: 'Malate', code: '137409004' },
        { value: '137409005', label: 'Paco', code: '137409005' },
        { value: '137409006', label: 'Quiapo', code: '137409006' },
        { value: '137409007', label: 'Sampaloc', code: '137409007' },
        { value: '137409008', label: 'San Miguel', code: '137409008' },
        { value: '137409009', label: 'Santa Cruz', code: '137409009' },
        { value: '137409010', label: 'Tondo', code: '137409010' },
      ]
    };
    return fallbackData[cityCode] || [];
  }

  // Clear all cached data
  async clearCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const locationKeys = keys.filter(key => key.startsWith('location_'));
      await AsyncStorage.multiRemove(locationKeys);
    } catch (error) {
      console.warn('Error clearing cache:', error);
    }
  }
}

export default new LocationService();
