import { OrderStatus, Product } from './types';

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const money = (v: string | number | null | undefined) => brl.format(Number(v ?? 0));

export const qty = (v: string | number, unit?: string) =>
  `${Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 3 })}${unit === 'KG' ? ' kg' : unit === 'UNIT' ? ' un' : ''}`;

export const STATUS_LABEL: Record<OrderStatus, string> = {
  AGUARDANDO_PAGAMENTO: 'Aguardando Pagamento',
  EM_SEPARACAO: 'Em Separação',
  EM_TRANSPORTE: 'Em Transporte',
  CONCLUIDO: 'Concluído',
};
export const STATUS_ORDER: OrderStatus[] = ['AGUARDANDO_PAGAMENTO', 'EM_SEPARACAO', 'EM_TRANSPORTE', 'CONCLUIDO'];

export const PAGAMENTO_LABEL = { PIX: 'Pix', CARTAO: 'Cartão', DINHEIRO: 'Dinheiro' } as const;

/** Passo de quantidade: 0,5 kg para produtos a peso, 1 para unidades. */
export const stepOf = (p: Product) => (p.unidadeMedida === 'KG' ? 0.5 : 1);

/** Mesma regra do servidor (exibição): atacado ao atingir a cota mínima. */
export function precoPara(p: Product, quantidade: number) {
  const atacado = p.precoAtacado != null && p.qtdMinAtacado != null && quantidade >= Number(p.qtdMinAtacado);
  const unitario = Number(atacado ? p.precoAtacado : p.precoVarejo);
  return { atacado, unitario, subtotal: Math.round(unitario * quantidade * 100) / 100 };
}

export function errorMessage(err: unknown): string {
  const data = (err as { response?: { data?: { message?: string; issues?: { campo: string; erro: string }[] } } })?.response?.data;
  if (data?.issues?.length) return data.issues.map((i) => `${i.campo}: ${i.erro}`).join('\n');
  return data?.message ?? 'Não foi possível conectar ao servidor. Verifique se a API está rodando.';
}
