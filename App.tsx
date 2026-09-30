import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider, useCart } from './src/context/CartContext';
import AccountScreen from './src/screens/AccountScreen';
import AddressFormScreen from './src/screens/AddressFormScreen';
import CartScreen from './src/screens/CartScreen';
import CatalogScreen from './src/screens/CatalogScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import LoginScreen from './src/screens/LoginScreen';
import OrderDetailScreen from './src/screens/OrderDetailScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const headerStyle = { headerStyle: { backgroundColor: colors.green }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: '700' as const } };

function Tabs() {
  const { count } = useCart();
  const icon = (name: keyof typeof Ionicons.glyphMap) => ({ color, size }: { color: string; size: number }) =>
    <Ionicons name={name} color={color} size={size} />;

  return (
    <Tab.Navigator screenOptions={{ ...headerStyle, tabBarActiveTintColor: colors.green }}>
      <Tab.Screen name="Catalogo" component={CatalogScreen} options={{ title: 'Catálogo', tabBarIcon: icon('leaf-outline') }} />
      <Tab.Screen name="Carrinho" component={CartScreen} options={{ tabBarIcon: icon('cart-outline'), tabBarBadge: count > 0 ? count : undefined }} />
      <Tab.Screen name="Pedidos" component={OrdersScreen} options={{ title: 'Meus pedidos', tabBarIcon: icon('receipt-outline') }} />
      <Tab.Screen name="Conta" component={AccountScreen} options={{ tabBarIcon: icon('person-outline') }} />
    </Tab.Navigator>
  );
}

function Routes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={headerStyle}>
      {user ? (
        <>
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Finalizar pedido' }} />
          <Stack.Screen name="AddressForm" component={AddressFormScreen} options={{ title: 'Novo endereço' }} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'Pedido' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Criar conta' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <Routes />
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
