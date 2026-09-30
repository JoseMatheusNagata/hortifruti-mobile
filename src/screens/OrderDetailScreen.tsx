import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { api } from '../api';
import { colors } from '../theme';
import { Order } from '../types';
import { errorMessage, money, PAGAMENTO_LABEL, qty, STATUS_LABEL, STATUS_ORDER } from '../utils';

export default function OrderDetailScreen({ route }: any) {
  const [order, setOrder] = useState<Order | null>(null);
  const [erro, setErro] = useState('');

  useFocusEffect(
    useCallback(() => {
      api.get<Order>(`/orders/${route.params.id}`).then((r) => setOrder(r.data)).catch((e) => setErro(errorMessage(e)));
    }, [route.params.id]),
  );

  if (erro) return <Text style={s.error}>{erro}</Text>;
  if (!order) return <ActivityIndicator style={{ marginTop: 40 }} color={colors.green} size="large" />;

  const current = STATUS_ORDER.indexOf(order.status);

  return (
    <ScrollView contentContainerStyle={s.container}>
      <View style={s.card}>
        <Text style={s.title}>Acompanhamento</Text>
        {STATUS_ORDER.map((st, i) => (
          <View key={st} style={s.step}>
            <View style={[s.dot, i <= current && s.dotOn]} />
            <Text style={[s.stepText, i === current && { fontWeight: '800', color: colors.greenDark }, i > current && { color: colors.muted }]}>
              {STATUS_LABEL[st]}
            </Text>
          </View>
        ))}
      </View>

      <View style={s.card}>
        <Text style={s.title}>Itens</Text>
        {order.items.map((i) => (
          <View key={i.id} style={s.itemRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.itemName}>{i.product.nome}</Text>
              <Text style={s.muted}>{qty(i.quantidade, i.product.unidadeMedida)} × {money(i.precoUnitario)}</Text>
            </View>
            <Text style={s.itemName}>{money(i.subtotal)}</Text>
          </View>
        ))}
        <View style={[s.itemRow, { borderTopWidth: 1, borderColor: colors.border, paddingTop: 10 }]}>
          <Text style={s.title}>Total</Text>
          <Text style={s.total}>{money(order.total)}</Text>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.title}>Entrega e pagamento</Text>
        <Text style={s.itemName}>{order.address.rua}, {order.address.numero}</Text>
        <Text style={s.muted}>{order.address.bairro} • CEP {order.address.cep}</Text>
        <Text style={[s.muted, { marginTop: 6 }]}>Pagamento: {PAGAMENTO_LABEL[order.formaPagamento]}</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { padding: 12, gap: 12, backgroundColor: colors.bg },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border, gap: 8 },
  title: { fontSize: 16, fontWeight: '800', color: colors.text },
  step: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.border },
  dotOn: { backgroundColor: colors.green },
  stepText: { fontSize: 15, color: colors.text },
  itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  itemName: { fontWeight: '700', color: colors.text },
  muted: { color: colors.muted, fontSize: 12 },
  total: { fontSize: 20, fontWeight: '800', color: colors.greenDark },
  error: { textAlign: 'center', color: colors.danger, marginTop: 40, padding: 20 },
});
