interface FilterPanelProps {
  tipoServico: string;
  marca: string;
  onTipoServicoChange: (v: string) => void;
  onMarcaChange: (v: string) => void;
}

const TIPOS_SERVICO = [
  { value: '', label: 'Todos os serviços' },
  { value: 'revisao_completa', label: 'Revisão Completa' },
  { value: 'oleo', label: 'Troca de Óleo' },
  { value: 'freios', label: 'Freios' },
  { value: 'suspensao', label: 'Suspensão' },
  { value: 'eletrica', label: 'Elétrica' },
  { value: 'pneus', label: 'Pneus' },
];

const MARCAS = [
  { value: '', label: 'Todas as marcas' },
  { value: 'Honda', label: 'Honda' },
  { value: 'Yamaha', label: 'Yamaha' },
  { value: 'Suzuki', label: 'Suzuki' },
  { value: 'Kawasaki', label: 'Kawasaki' },
];

export default function FilterPanel({ tipoServico, marca, onTipoServicoChange, onMarcaChange }: FilterPanelProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <select
        value={tipoServico}
        onChange={(e) => onTipoServicoChange(e.target.value)}
        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        {TIPOS_SERVICO.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

      <select
        value={marca}
        onChange={(e) => onMarcaChange(e.target.value)}
        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        {MARCAS.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>
    </div>
  );
}
