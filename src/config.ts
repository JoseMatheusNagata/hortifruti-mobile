import { Platform } from 'react-native';

/**
 * Endereço da API.
 * - Emulador Android: 10.0.2.2 aponta para o localhost do seu PC.
 * - Celular físico: use o IP do PC na rede (ex.: http://192.168.0.10:3334)
 *   via variável EXPO_PUBLIC_API_URL no arquivo .env.
 */
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? (Platform.OS === 'android' ? 'http://10.0.2.2:3334' : 'http://localhost:3334');
