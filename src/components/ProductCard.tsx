import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../context/CartContext';
import { colors } from '../theme';
import { Product } from '../types';
import { money, qty } from '../utils';
import QuantityStepper from './QuantityStepper';

export default function ProductCard({ product }: { product: Product }) {
  const { quantityOf, change } = useCart();
  const q = quantityOf(product.id);
  const unit = product.unidadeMedida === 'KG' ? 'kg' : 'un';

  return (
    <View style={s.card}>
      <View style={{ flex: 1 }}>
        <Text style={s.category}>{product.category?.nome}</Text>
        <Text style={s.name}>{product.nome}</Text>
        <Text style={s.price}>{money(product.precoVarejo)}<Text style={s.unit}>/{unit}</Text></Text>
        {product.precoAtacado && product.qtdMinAtacado && (
          <Text style={s.wholesale}>
            Atacado: {money(product.precoAtacado)}/{unit} a partir de {qty(product.qtdMinAtacado, product.unidadeMedida)}
          </Text>
        )}
      </View>
      {q === 0 ? (
        <TouchableOpacity style={s.add} onPress={() => change(product, 1)}>
          <Text style={s.addText}>Adicionar</Text>
        </TouchableOpacity>
      ) : (
        <QuantityStepper label={qty(q, product.unidadeMedida)} onMinus={() => change(product, -1)} onPlus={() => change(product, 1)} />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border },
  category: { fontSize: 11, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text, marginVertical: 2 },
  price: { fontSize: 16, fontWeight: '700', color: colors.greenDark },
  unit: { fontSize: 12, fontWeight: '400', color: colors.muted },
  wholesale: { fontSize: 12, color: colors.green, marginTop: 2 },
  add: { backgroundColor: colors.green, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 8 },
  addText: { color: '#fff', fontWeight: '700' },
});
