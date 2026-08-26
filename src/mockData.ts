import { User, Cotacao } from './types';

export const INITIAL_USERS: User[] = [
  {
    uid: 'vend_1',
    email: 'carlos.mendes@segurflow.com.br',
    nome: 'Carlos Mendes',
    role: 'vendedor',
    ativo: true,
    cargo: 'Consultor de Seguros Sênior',
    telefone: '(11) 98765-4321',
    dataCriacao: '2025-01-15T09:00:00Z',
    metaFaturamento: 100000,
    metaVolume: 20,
    metaTicketMedio: 5000,
    metaConversao: 35,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    uid: 'vend_2',
    email: 'mariana.silva@segurflow.com.br',
    nome: 'Mariana Silva',
    role: 'vendedor',
    ativo: true,
    cargo: 'Especialista em Benefícios & Saúde',
    telefone: '(11) 97654-3210',
    dataCriacao: '2025-02-01T10:30:00Z',
    metaFaturamento: 120000,
    metaVolume: 15,
    metaTicketMedio: 8000,
    metaConversao: 42,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    uid: 'vend_3',
    email: 'roberto.gomes@segurflow.com.br',
    nome: 'Roberto Gomes',
    role: 'vendedor',
    ativo: true,
    cargo: 'Consultor Corporate & Ramos Elementares',
    telefone: '(11) 99123-4567',
    dataCriacao: '2025-02-10T14:00:00Z',
    metaFaturamento: 90000,
    metaVolume: 18,
    metaTicketMedio: 5000,
    metaConversao: 28,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    uid: 'admin_1',
    email: 'beatriz.santos@segurflow.com.br',
    nome: 'Beatriz Santos',
    role: 'admin',
    ativo: true,
    cargo: 'Diretora Comercial & Operações',
    telefone: '(11) 98888-0000',
    dataCriacao: '2024-12-01T08:00:00Z',
    metaFaturamento: 310000,
    metaVolume: 53,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_COTACOES: Cotacao[] = [
  {
    id: 'COT-8941',
    vendedorId: 'vend_1',
    vendedorNome: 'Carlos Mendes',
    cliente: 'Indústria Metalúrgica Aliança Ltda',
    clienteCnpj: '45.123.890/0001-32',
    clienteEmail: 'diretoria@metalurgicaalianca.com.br',
    clienteTelefone: '(11) 3456-7890',
    valorTotal: 34500,
    seguradora: 'Allianz Seguros',
    produtos: ['Seguro Compreensivo Empresarial', 'Responsabilidade Civil Operações', 'Danos Elétricos R$ 500k'],
    ramo: 'Empresarial',
    status: 'enviada',
    origem: 'Indicação de Cliente',
    dataCriacao: '2026-08-20T10:15:00Z',
    dataUltimaAtualizacao: '2026-08-22T14:30:00Z',
    pdfName: 'Cotacao_Allianz_Metalurgica_2026.pdf',
    observacoes: 'Proposta com franquia reduzida e cláusula de vendaval inclusa.',
    historicoStatus: [
      { status: 'nova', data: '2026-08-20T10:15:00Z', usuarioNome: 'Carlos Mendes', observacao: 'Cotação extraída automaticamente via PDF' },
      { status: 'em_analise', data: '2026-08-21T09:00:00Z', usuarioNome: 'Carlos Mendes', observacao: 'Ajuste de coberturas acessórias com o subscritor' },
      { status: 'enviada', data: '2026-08-22T14:30:00Z', usuarioNome: 'Carlos Mendes', observacao: 'Proposta formal enviada ao Diretor Financeiro' }
    ]
  },
  {
    id: 'COT-8942',
    vendedorId: 'vend_1',
    vendedorNome: 'Carlos Mendes',
    cliente: 'Dr. Lucas Ferreira Martins',
    clienteCnpj: '234.567.890-12',
    clienteEmail: 'lucas.martins@clinicaferreira.med.br',
    clienteTelefone: '(11) 98111-2233',
    valorTotal: 9800,
    seguradora: 'Porto Seguro',
    produtos: ['Seguro Auto Premium (BMW 320i)', 'Carro Reserva Plus', 'Vidros Blindados'],
    ramo: 'Automóvel',
    status: 'revisao',
    origem: 'Google Ads',
    dataCriacao: '2026-08-18T16:40:00Z',
    dataUltimaAtualizacao: '2026-08-24T11:20:00Z',
    pdfName: 'Porto_Auto_DrLucas_BMW.pdf',
    observacoes: 'Cliente pediu desconto de 5% para fechar junto com o seguro residencial.',
    historicoStatus: [
      { status: 'nova', data: '2026-08-18T16:40:00Z', usuarioNome: 'Carlos Mendes' },
      { status: 'enviada', data: '2026-08-19T10:00:00Z', usuarioNome: 'Carlos Mendes' },
      { status: 'aguardando', data: '2026-08-21T15:00:00Z', usuarioNome: 'Carlos Mendes' },
      { status: 'revisao', data: '2026-08-24T11:20:00Z', usuarioNome: 'Carlos Mendes', observacao: 'Negociando comissão de 18% para 15% para fechar' }
    ]
  },
  {
    id: 'COT-8943',
    vendedorId: 'vend_1',
    vendedorNome: 'Carlos Mendes',
    cliente: 'TechNova Soluções Digitais S.A.',
    clienteCnpj: '12.987.654/0001-99',
    clienteEmail: 'contato@technova.com.br',
    clienteTelefone: '(11) 4004-9988',
    valorTotal: 41200,
    seguradora: 'SulAmérica Seguros',
    produtos: ['Seguro Saúde PME (48 vidas)', 'Odontológico Integrado', 'Coparticipação 20%'],
    ramo: 'Saúde PME',
    status: 'fechada',
    origem: 'Redes Sociais (LinkedIn)',
    dataCriacao: '2026-08-05T08:30:00Z',
    dataFechamento: '2026-08-25T17:00:00Z',
    dataUltimaAtualizacao: '2026-08-25T17:00:00Z',
    pdfName: 'SulAmerica_TechNova_48vidas.pdf',
    observacoes: 'Contrato assinado digitalmente. Vigência a partir de 01/09.',
    historicoStatus: [
      { status: 'nova', data: '2026-08-05T08:30:00Z', usuarioNome: 'Carlos Mendes' },
      { status: 'em_analise', data: '2026-08-07T11:00:00Z', usuarioNome: 'Carlos Mendes' },
      { status: 'enviada', data: '2026-08-10T14:00:00Z', usuarioNome: 'Carlos Mendes' },
      { status: 'revisao', data: '2026-08-18T16:00:00Z', usuarioNome: 'Carlos Mendes' },
      { status: 'fechada', data: '2026-08-25T17:00:00Z', usuarioNome: 'Carlos Mendes', observacao: 'Proposta aceita e faturada com sucesso!' }
    ]
  },
  {
    id: 'COT-8944',
    vendedorId: 'vend_1',
    vendedorNome: 'Carlos Mendes',
    cliente: 'Camila Rodrigues Neves',
    clienteCnpj: '345.678.901-44',
    clienteEmail: 'camila.neves@gmail.com',
    clienteTelefone: '(11) 97722-3344',
    valorTotal: 3200,
    seguradora: 'Tokio Marine',
    produtos: ['Seguro Residencial Sob Medida', 'Danos Elétricos', 'Assistência 24h VIP'],
    ramo: 'Residencial',
    status: 'nova',
    origem: 'Indicação',
    dataCriacao: '2026-08-26T09:10:00Z',
    dataUltimaAtualizacao: '2026-08-26T09:10:00Z',
    pdfName: 'Tokio_Residencial_Camila.pdf',
    observacoes: 'Imóvel em condomínio fechado em Alphaville.',
    historicoStatus: [
      { status: 'nova', data: '2026-08-26T09:10:00Z', usuarioNome: 'Carlos Mendes', observacao: 'Importado via PDF com IA' }
    ]
  },
  {
    id: 'COT-8945',
    vendedorId: 'vend_2',
    vendedorNome: 'Mariana Silva',
    cliente: 'Hospital & Maternidade São Geraldo',
    clienteCnpj: '08.765.432/0001-11',
    clienteEmail: 'compras@saogeraldo.med.br',
    clienteTelefone: '(11) 2233-4455',
    valorTotal: 68000,
    seguradora: 'Bradesco Seguros',
    produtos: ['Seguro Saúde Corporativo Nacional Plus', 'Remissão de Pagamento', 'Check-up Executivo'],
    ramo: 'Saúde Corporativo',
    status: 'revisao',
    origem: 'Parceria Comercial',
    dataCriacao: '2026-08-12T11:00:00Z',
    dataUltimaAtualizacao: '2026-08-23T15:45:00Z',
    pdfName: 'BradescoSaude_HospitalSaoGeraldo.pdf',
    observacoes: 'Ajuste de rede credenciada para incluir hospitais Sírio e Einstein.',
    historicoStatus: [
      { status: 'nova', data: '2026-08-12T11:00:00Z', usuarioNome: 'Mariana Silva' },
      { status: 'em_analise', data: '2026-08-14T09:30:00Z', usuarioNome: 'Mariana Silva' },
      { status: 'enviada', data: '2026-08-16T14:00:00Z', usuarioNome: 'Mariana Silva' },
      { status: 'revisao', data: '2026-08-23T15:45:00Z', usuarioNome: 'Mariana Silva' }
    ]
  },
  {
    id: 'COT-8946',
    vendedorId: 'vend_2',
    vendedorNome: 'Mariana Silva',
    cliente: 'Logística Rápida Express S/A',
    clienteCnpj: '61.234.567/0001-88',
    clienteEmail: 'seguros@rapidaexpress.com.br',
    clienteTelefone: '(11) 3344-5566',
    valorTotal: 52000,
    seguradora: 'Porto Seguro',
    produtos: ['Vida em Grupo Capital Global R$ 5MM', 'Invalidez Funcional Permanente', 'Auxílio Funeral Estendido'],
    ramo: 'Vida em Grupo',
    status: 'fechada',
    origem: 'Base Própria',
    dataCriacao: '2026-08-02T10:00:00Z',
    dataFechamento: '2026-08-24T16:30:00Z',
    dataUltimaAtualizacao: '2026-08-24T16:30:00Z',
    pdfName: 'Porto_VidaGrupo_RapidaExpress.pdf',
    observacoes: '120 colaboradores cobertos. Primeira parcela emitida.',
    historicoStatus: [
      { status: 'nova', data: '2026-08-02T10:00:00Z', usuarioNome: 'Mariana Silva' },
      { status: 'enviada', data: '2026-08-08T15:00:00Z', usuarioNome: 'Mariana Silva' },
      { status: 'fechada', data: '2026-08-24T16:30:00Z', usuarioNome: 'Mariana Silva' }
    ]
  },
  {
    id: 'COT-8947',
    vendedorId: 'vend_3',
    vendedorNome: 'Roberto Gomes',
    cliente: 'Construtora Horizonte Verde',
    clienteCnpj: '18.444.999/0001-20',
    clienteEmail: 'contato@horizonteverde.eng.br',
    clienteTelefone: '(11) 4567-8901',
    valorTotal: 29500,
    seguradora: 'Mapfre Seguros',
    produtos: ['Riscos de Engenharia (Obra Residencial 14 andares)', 'RC Cruzada', 'Desmoronamento'],
    ramo: 'Riscos de Engenharia',
    status: 'aguardando',
    origem: 'Google Ads',
    dataCriacao: '2026-08-15T14:20:00Z',
    dataUltimaAtualizacao: '2026-08-21T09:00:00Z',
    pdfName: 'Mapfre_RiscosEngenharia_Horizonte.pdf',
    observacoes: 'Aguardando aprovação do comitê de obras do cliente.',
    historicoStatus: [
      { status: 'nova', data: '2026-08-15T14:20:00Z', usuarioNome: 'Roberto Gomes' },
      { status: 'em_analise', data: '2026-08-16T10:00:00Z', usuarioNome: 'Roberto Gomes' },
      { status: 'enviada', data: '2026-08-18T16:00:00Z', usuarioNome: 'Roberto Gomes' },
      { status: 'aguardando', data: '2026-08-21T09:00:00Z', usuarioNome: 'Roberto Gomes' }
    ]
  },
  {
    id: 'COT-8948',
    vendedorId: 'vend_3',
    vendedorNome: 'Roberto Gomes',
    cliente: 'Auto Posto Estrela da Serra',
    clienteCnpj: '03.222.111/0001-55',
    clienteEmail: 'financeiro@estreladaserra.com.br',
    clienteTelefone: '(11) 4789-0123',
    valorTotal: 14200,
    seguradora: 'HDI Seguros',
    produtos: ['Empresarial Postos de Combustíveis', 'RC Poluição Súbita', 'Incêndio e Explosão'],
    ramo: 'Empresarial',
    status: 'perdida',
    origem: 'Indicação',
    motivoPerda: 'Fechou com o banco onde mantém a conta jurídica',
    dataCriacao: '2026-08-10T09:00:00Z',
    dataUltimaAtualizacao: '2026-08-22T17:00:00Z',
    pdfName: 'HDI_PostoEstrela.pdf',
    observacoes: 'Gerente da conta ofereceu reciprocidade com taxa de boleto.',
    historicoStatus: [
      { status: 'nova', data: '2026-08-10T09:00:00Z', usuarioNome: 'Roberto Gomes' },
      { status: 'enviada', data: '2026-08-12T14:00:00Z', usuarioNome: 'Roberto Gomes' },
      { status: 'perdida', data: '2026-08-22T17:00:00Z', usuarioNome: 'Roberto Gomes', observacao: 'Perda registrada devido à reciprocidade bancária' }
    ]
  },
  {
    id: 'COT-8949',
    vendedorId: 'vend_1',
    vendedorNome: 'Carlos Mendes',
    cliente: 'Transportadora TransValle Eireli',
    clienteCnpj: '27.888.333/0001-77',
    clienteEmail: 'gerencia@transvalle.com.br',
    clienteTelefone: '(11) 98333-7788',
    valorTotal: 18900,
    seguradora: 'Tokio Marine',
    produtos: ['Seguro de Frota Caminhões (6 unidades)', 'RCTR-C Transporte Cargas', 'Rastreamento Sascar'],
    ramo: 'Transportes & Frotas',
    status: 'em_analise',
    origem: 'Parceria Comercial',
    dataCriacao: '2026-08-25T15:30:00Z',
    dataUltimaAtualizacao: '2026-08-26T08:45:00Z',
    pdfName: 'Tokio_Frota_Transvalle.pdf',
    observacoes: 'Avaliando se inclui seguro de vida para os motoristas no pacote.',
    historicoStatus: [
      { status: 'nova', data: '2026-08-25T15:30:00Z', usuarioNome: 'Carlos Mendes' },
      { status: 'em_analise', data: '2026-08-26T08:45:00Z', usuarioNome: 'Carlos Mendes' }
    ]
  }
];

export const SAMPLE_PDF_PRESETS = [
  {
    title: 'Porto Seguro Auto Premium - Audi Q3',
    seguradora: 'Porto Seguro',
    ramo: 'Automóvel',
    fileName: 'Porto_Seguro_Auto_AudiQ3_Cotacao.pdf',
    mockData: {
      cliente: 'Patrícia Helena Silveira',
      clienteCnpj: '412.890.123-88',
      clienteEmail: 'patricia.silveira@advogados.com.br',
      clienteTelefone: '(11) 99455-8822',
      valorTotal: 6450.80,
      seguradora: 'Porto Seguro Cia de Seguros',
      produtos: ['Seguro Auto Completo 100% Tabela FIPE', 'Cobertura de Vidros, Faróis e Retrovisores', 'Carro Reserva Ilimitado', 'Danos Materiais R$ 200.000', 'Danos Corporais R$ 200.000'],
      dataCotacao: '2026-08-26',
      ramo: 'Automóvel',
      origem: 'Google Ads',
      resumoCoberturas: 'Franquia Reduzida R$ 2.800,00 | Guincho sem limite de KM | Desconto de 15% por Cartão de Crédito Porto'
    },
    rawSnippet: `PORTO SEGURO CIA DE SEGUROS GERAIS - CNPJ 61.198.164/0001-60
PROPOSTA DE SEGURO AUTOMÓVEL - RAMO 0531
Proposta Nº: 2026/08-994821
Segurado: Patrícia Helena Silveira
CPF: 412.890.123-88 | E-mail: patricia.silveira@advogados.com.br | Tel: (11) 99455-8822
Veículo: AUDI Q3 BLACK 2.0 TFSI QUATTRO S TRONIC ANO 2024/2025
Código FIPE: 008245-7 | Valor Referência FIPE: R$ 310.000,00
Coberturas Contratadas:
- Compreensiva (Colisão, Incêndio, Roubo/Furto): 100% FIPE
- RCF-V Danos Materiais a Terceiros: R$ 200.000,00
- RCF-V Danos Corporais a Terceiros: R$ 200.000,00
- Acidentes Pessoais por Passageiro (APP): R$ 50.000,00
- Assistência 24 Horas VIP com Guincho Ilimitado
- Vidros Completo Plus, Faróis, Lanternas e Retrovisores
- Carro Reserva Categoria Médio por tempo Ilimitado
Prêmio Líquido: R$ 5.972,96 | IOF (7,38%): R$ 440,80 | Custo Apólice: R$ 37,04
PRÊMIO TOTAL DA COTAÇÃO: R$ 6.450,80 em até 10x sem juros.`
  },
  {
    title: 'SulAmérica Saúde PME - 35 Vidas',
    seguradora: 'SulAmérica',
    ramo: 'Saúde PME',
    fileName: 'SulAmerica_PME_Inovare_35vidas.pdf',
    mockData: {
      cliente: 'Inovare Arquitetura e Urbanismo Ltda',
      clienteCnpj: '33.987.123/0001-45',
      clienteEmail: 'rh@inovarearquitetura.com.br',
      clienteTelefone: '(11) 3211-9000',
      valorTotal: 28940.00,
      seguradora: 'SulAmérica Saúde S.A.',
      produtos: ['Plano Especial 100 Nacional (25 titulares + 10 dependentes)', 'Reembolso Consulta R$ 280,00', 'Rede Albert Einstein & Sírio-Libanês (Diretoria)', 'Odontológico Prestige'],
      dataCotacao: '2026-08-25',
      ramo: 'Saúde PME',
      origem: 'Indicação de Cliente',
      resumoCoberturas: 'Isenção total de carências (CPT reduzida) | Coparticipação ambulatorial 20% | Seguro Viagem Internacional Incluso'
    },
    rawSnippet: `SULAMÉRICA SAÚDE S.A. - COTAÇÃO EMPRESARIAL PME COMPENSA
Estudo de Plano de Saúde Coletivo Empresarial
Empresa Proponente: Inovare Arquitetura e Urbanismo Ltda
CNPJ: 33.987.123/0001-45 | Contato RH: rh@inovarearquitetura.com.br | (11) 3211-9000
Número de Vidas: 35 Beneficiários (25 Colaboradores Titulares + 10 Dependentes)
Produtos Selecionados:
1. Plano Especial 100 Nacional (Quarto Individual) - 30 vidas
2. Plano Executivo Nacional Plus - 5 vidas (Diretoria)
3. Módulo Odonto Prestige Nacional - 35 vidas
Resumo Financeiro Mensal:
- Mensalidade Saúde: R$ 27.240,00
- Mensalidade Odonto: R$ 1.700,00
VALOR TOTAL DA MENSALIDADE: R$ 28.940,00`
  },
  {
    title: 'Allianz Empresarial Multirrisco - Fábrica de Cosméticos',
    seguradora: 'Allianz Seguros',
    ramo: 'Empresarial',
    fileName: 'Allianz_Empresarial_NatuBio_Cosmeticos.pdf',
    mockData: {
      cliente: 'NatuBio Cosméticos da Amazônia Ltda',
      clienteCnpj: '09.345.678/0001-12',
      clienteEmail: 'financeiro@natubio.ind.br',
      clienteTelefone: '(11) 4588-1200',
      valorTotal: 47800.00,
      seguradora: 'Allianz Seguros S/A',
      produtos: ['Incêndio, Queda de Raio e Explosão (LMI R$ 12.000.000)', 'Responsabilidade Civil Operações e Produtos', 'Danos Elétricos e Máquinas R$ 1.500.000', 'Lucros Cessantes 6 Meses'],
      dataCotacao: '2026-08-24',
      ramo: 'Empresarial',
      origem: 'Parceria Comercial',
      resumoCoberturas: 'Inspeção de risco aprovada com sistema de sprinklers | Franquia de 10% com mínimo de R$ 5.000'
    },
    rawSnippet: `ALLIANZ SEGUROS S.A. - CNPJ: 61.573.796/0001-66
COTAÇÃO COMPREENSIVO EMPRESARIAL MULTIRRISCO
Proponente: NatuBio Cosméticos da Amazônia Ltda
CNPJ: 09.345.678/0001-12 | E-mail: financeiro@natubio.ind.br | Telefone: (11) 4588-1200
Local do Risco: Av. Industrial das Nações, 1420 - Cotia/SP
Atividade: Indústria e envase de produtos cosméticos e higiene pessoal
Limites Máximos de Indenização (LMI):
- Básica Incêndio / Queda de Raio / Explosão: R$ 12.000.000,00
- Danos Elétricos e Quebra de Maquinário: R$ 1.500.000,00
- Responsabilidade Civil Operações / Empregador: R$ 2.000.000,00
- Vendaval, Furacão, Granizo e Queda de Aeronaves: R$ 1.000.000,00
- Despesas Fixas / Lucros Cessantes (6 Meses): R$ 3.000.000,00
Prêmio Líquido Anual: R$ 44.514,80
IOF (7,38%): R$ 3.285,20
TOTAL DO PRÊMIO ANUAL: R$ 47.800,00`
  },
  {
    title: 'Bradesco Vida Individual - Proteção Familiar',
    seguradora: 'Bradesco Seguros',
    ramo: 'Vida Individual',
    fileName: 'Bradesco_VidaViva_CarlosEduardo.pdf',
    mockData: {
      cliente: 'Carlos Eduardo Nogueira Prado',
      clienteCnpj: '198.765.432-09',
      clienteEmail: 'carlos.prado@engenhariacivil.com',
      clienteTelefone: '(11) 98222-1144',
      valorTotal: 4890.00,
      seguradora: 'Bradesco Vida e Previdência',
      produtos: ['Morte Qualquer Causa (Capital R$ 2.000.000)', 'Invalidez Permanente Total por Acidente R$ 2.000.000', 'Doenças Graves Plus (R$ 500.000)', 'Diária de Incapacidade Temporária DIT'],
      dataCotacao: '2026-08-26',
      ramo: 'Vida Individual',
      origem: 'Base Própria',
      resumoCoberturas: 'Segurado sem agravamento médico | Capital segurado indexado anualmente pelo IPCA'
    },
    rawSnippet: `BRADESCO VIDA E PREVIDÊNCIA S.A.
PROPOSTA INDIVIDUAL BRADESCO VIDA VIVA
Segurado: Carlos Eduardo Nogueira Prado | Idade: 39 anos | Profissão: Engenheiro Civil
CPF: 198.765.432-09 | E-mail: carlos.prado@engenhariacivil.com | Tel: (11) 98222-1144
Capitais Segurados:
- Morte Acidental ou Natural: R$ 2.000.000,00
- Invalidez Permanente Total ou Parcial por Acidente (IPA): R$ 2.000.000,00
- Diagnóstico de Doenças Graves (30 patologias): R$ 500.000,00
- Assistência Funeral Familiar com Repatriação
- Diária por Incapacidade Temporária (DIT): R$ 10.000,00/mês
Prêmio Anual Total: R$ 4.890,00`
  }
];

export const COLUMNS: { id: Cotacao['status']; title: string; color: string; badgeBg: string; badgeText: string; description: string }[] = [
  {
    id: 'nova',
    title: 'Nova Cotação',
    description: 'Cotações recém-extraídas aguardando primeiro contato',
    color: 'border-blue-500 text-blue-700',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    badgeText: 'Nova'
  },
  {
    id: 'em_analise',
    title: 'Em Análise',
    description: 'Ajustando coberturas, franquias e cálculos com subscrição',
    color: 'border-amber-500 text-amber-700',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeText: 'Em Análise'
  },
  {
    id: 'enviada',
    title: 'Enviada ao Cliente',
    description: 'Proposta formal transmitida para avaliação do proponente',
    color: 'border-indigo-500 text-indigo-700',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badgeText: 'Enviada'
  },
  {
    id: 'aguardando',
    title: 'Aguardando Retorno',
    description: 'Cliente analisando condições e prazos de decisão',
    color: 'border-purple-500 text-purple-700',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    badgeText: 'Aguardando'
  },
  {
    id: 'revisao',
    title: 'Revisão / Negociação',
    description: 'Negociação de taxa, comissão, formas de parcelamento ou coberturas',
    color: 'border-orange-500 text-orange-700',
    badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
    badgeText: 'Negociação'
  },
  {
    id: 'fechada',
    title: 'Fechada (Ganho)',
    description: 'Proposta aceita, transmitida e apólice faturada',
    color: 'border-emerald-500 text-emerald-700',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'Fechada'
  },
  {
    id: 'perdida',
    title: 'Perdida',
    description: 'Proposta recusada ou não concretizada com motivo documentado',
    color: 'border-slate-400 text-slate-600',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
    badgeText: 'Perdida'
  }
];
