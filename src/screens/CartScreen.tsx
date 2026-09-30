import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QuantityStepper from '../components/QuantityStepper';
import { useCart } from '../context/CartContext';
import { colors } from '../theme';
import { money, precoPara, qty } from '../utils';

export default function CartScreen({ navigation }: any) {
  const { items, total, change } = useCart();

  if (items.length === 0) {
    return (
      <View style={s.emptyWrap}>
        <Text style={{ fontSize: 48 }}>🛒</Text>
        <Text style={s.emptyText}>Seu carrinho está vazio</Text>
        <TouchableOpacity style={s.button} onPress={() => navigation.navigate('Catalogo')}>
          <Text style={s.buttonText}>Ver catálogo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.product.id}
        contentContainerStyle={{ padding: 12, gap: 10 }}
        renderItem={({ item }) => {
          const p = precoPara(item.product, item.quantidade);
          return (
            <View style={s.card}>
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{item.product.nome}</Text>
                <Text style={s.muted}>
                  {money(p.unitario)}/{item.product.unidadeMedida === 'KG' ? 'kg' : 'un'}
                  {p.atacado ? '  •  preço de atacado ✓' : ''}
                </Text>
                <Text style={s.subtotal}>{money(p.subtotal)}</Text>
              </View>
              <QuantityStepper
                label={qty(item.quantidade, item.product.unidadeMedida)}
                onMinus={() => change(item.product, -1)}
                onPlus={() => change(item.product, 1)}
              />
            </View>
          );
        }}
      />
      <View style={s.footer}>
        <View>
          <Text style={s.muted}>Total estimado</Text>
          <Text style={s.total}>{money(total)}</Text>
        </View>
        <TouchableOpacity style={s.button} onPress={() => navigation.navigate('Checkout')}>
          <Text style={s.buttonText}>Finalizar pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  card: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  muted: { color: colors.muted, fontSize: 12 },
  subtotal: { fontWeight: '700', color: colors.greenDark, marginTop: 4 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderColor: colors.border },
  total: { fontSize: 22, fontWeight: '800', color: colors.greenDark },
  button: { backgroundColor: colors.green, paddingHorizontal: 18, paddingVertical: 13, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: '700' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: colors.bg },
  emptyText: { color: colors.muted, fontSize: 16 },
});
