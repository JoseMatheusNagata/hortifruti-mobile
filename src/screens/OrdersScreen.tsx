import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../api';
import { colors } from '../theme';
import { Order } from '../types';
import { errorMessage, money, STATUS_LABEL } from '../utils';

export default function OrdersScreen({ navigation }: any) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState('');

  const load = useCallback(async () => {
    try {
      const { data } = await api.get<Order[]>('/orders');
      setOrders(data);
      setErro('');
    } catch (e) {
      setErro(errorMessage(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} color={colors.green} size="large" />;

  return (
    <FlatList
      style={{ backgroundColor: colors.bg }}
      data={orders}
      keyExtractor={(o) => o.id}
      contentContainerStyle={{ padding: 12, gap: 10 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
      ListEmptyComponent={<Text style={s.empty}>{erro || 'Você ainda não fez nenhum pedido.'}</Text>}
      renderItem={({ item }) => (
        <TouchableOpacity style={s.card} onPress={() => navigation.navigate('OrderDetail', { id: item.id })}>
          <View style={{ flex: 1 }}>
            <Text style={s.date}>{new Date(item.data).toLocaleString('pt-BR')}</Text>
            <Text style={s.muted}>{item.items.length} {item.items.length === 1 ? 'item' : 'itens'}</Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 4 }}>
            <Text style={s.total}>{money(item.total)}</Text>
            <Text style={[s.badge, item.status === 'CONCLUIDO' && s.badgeDone]}>{STATUS_LABEL[item.status]}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const s = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border },
  date: { fontWeight: '700', color: colors.text },
  muted: { color: colors.muted, fontSize: 12, marginTop: 2 },
  total: { fontWeight: '800', fontSize: 16, color: colors.greenDark },
  badge: { fontSize: 11, fontWeight: '700', color: '#8a6d00', backgroundColor: '#fff8e1', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, overflow: 'hidden' },
  badgeDone: { color: colors.greenDark, backgroundColor: colors.greenSoft },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 40 },
});
