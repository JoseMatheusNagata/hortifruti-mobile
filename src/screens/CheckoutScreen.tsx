import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../api';
import { useCart } from '../context/CartContext';
import { colors } from '../theme';
import { Address, FormaPagamento, Order } from '../types';
import { errorMessage, money, PAGAMENTO_LABEL } from '../utils';

export default function CheckoutScreen({ navigation }: any) {
  const { items, total, clear } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressId, setAddressId] = useState<string | null>(null);
  const [pagamento, setPagamento] = useState<FormaPagamento>('PIX');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useFocusEffect(
    useCallback(() => {
      api.get<Address[]>('/addresses')
        .then((r) => {
          setAddresses(r.data);
          setAddressId((cur) => cur ?? r.data[0]?.id ?? null);
        })
        .catch((e) => Alert.alert('Erro', errorMessage(e)))
        .finally(() => setLoading(false));
    }, []),
  );

  async function confirm() {
    if (!addressId) return Alert.alert('Atenção', 'Selecione ou cadastre um endereço de entrega.');
    setSending(true);
    try {
      const { data } = await api.post<Order>('/orders', {
        addressId,
        formaPagamento: pagamento,
        itens: items.map((i) => ({ productId: i.product.id, quantidade: i.quantidade })),
      });
      clear();
      navigation.replace('OrderDetail', { id: data.id });
    } catch (e) {
      Alert.alert('Não foi possível fechar o pedido', errorMessage(e));
    } finally {
      setSending(false);
    }
  }

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} color={colors.green} size="large" />;

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.section}>Endereço de entrega</Text>
      {addresses.map((a) => (
        <TouchableOpacity key={a.id} style={[s.option, addressId === a.id && s.optionActive]} onPress={() => setAddressId(a.id)}>
          <Text style={s.optionTitle}>{a.rua}, {a.numero}</Text>
          <Text style={s.muted}>{a.bairro} • CEP {a.cep}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={s.linkBtn} onPress={() => navigation.navigate('AddressForm')}>
        <Text style={s.link}>+ Cadastrar novo endereço</Text>
      </TouchableOpacity>

      <Text style={s.section}>Forma de pagamento</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {(Object.keys(PAGAMENTO_LABEL) as FormaPagamento[]).map((f) => (
          <TouchableOpacity key={f} style={[s.pay, pagamento === f && s.optionActive]} onPress={() => setPagamento(f)}>
            <Text style={[s.optionTitle, { textAlign: 'center' }]}>{PAGAMENTO_LABEL[f]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={s.summary}>
        <Text style={s.muted}>{items.length} {items.length === 1 ? 'item' : 'itens'} • total estimado</Text>
        <Text style={s.total}>{money(total)}</Text>
        <Text style={s.muted}>O valor final é calculado pelo servidor.</Text>
      </View>

      <TouchableOpacity style={s.button} onPress={confirm} disabled={sending}>
        {sending ? <ActivityIndicator color="#fff" /> : <Text style={s.buttonText}>Confirmar pedido</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { padding: 16, gap: 10, backgroundColor: colors.bg, flexGrow: 1 },
  section: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 8 },
  option: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, padding: 12 },
  optionActive: { borderColor: colors.green, backgroundColor: colors.greenSoft },
  optionTitle: { fontWeight: '700', color: colors.text },
  muted: { color: colors.muted, fontSize: 12 },
  pay: { flex: 1, backgroundColor: '#fff', borderWidth: 1.5, borderColor: colors.border, borderRadius: 10, padding: 12 },
  linkBtn: { paddingVertical: 4 },
  link: { color: colors.green, fontWeight: '700' },
  summary: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginTop: 8, gap: 2, borderWidth: 1, borderColor: colors.border },
  total: { fontSize: 24, fontWeight: '800', color: colors.greenDark },
  button: { backgroundColor: colors.green, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
