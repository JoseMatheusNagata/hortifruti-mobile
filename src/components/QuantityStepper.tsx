import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme';

interface Props { label: string; onMinus: () => void; onPlus: () => void }

export default function QuantityStepper({ label, onMinus, onPlus }: Props) {
  return (
    <View style={s.wrap}>
      <TouchableOpacity style={s.btn} onPress={onMinus} hitSlop={8}>
        <Ionicons name="remove" size={18} color={colors.green} />
      </TouchableOpacity>
      <Text style={s.value}>{label}</Text>
      <TouchableOpacity style={s.btn} onPress={onPlus} hitSlop={8}>
        <Ionicons name="add" size={18} color={colors.green} />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  btn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center' },
  value: { minWidth: 56, textAlign: 'center', fontWeight: '700', color: colors.text },
});
