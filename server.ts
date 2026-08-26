import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser with high limit for PDF uploads
  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ extended: true, limit: '30mb' }));

  // Initialize Gemini Client
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined in environment variables.');
    }
    return new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'SegurFlow API',
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
    });
  });

  // Extract Quote from PDF or Text with Gemini
  app.post('/api/extract-quote', async (req, res) => {
    try {
      const { fileBase64, mimeType = 'application/pdf', rawText, fileName = 'cotacao.pdf' } = req.body;

      if (!fileBase64 && !rawText) {
        return res.status(400).json({
          error: 'É necessário fornecer o arquivo em base64 ou o texto da cotação.',
        });
      }

      const ai = getGeminiClient();

      const systemPrompt = `Você é um assistente especialista em cotações e propostas de seguros de corretoras brasileiras (Porto Seguro, Bradesco Seguros, SulAmérica, Allianz, Tokio Marine, Mapfre, HDI, Zurich, Liberty, Sompo, etc.).
Sua tarefa é analisar minuciosamente o documento/texto da cotação de seguro em anexo e extrair com precisão cirúrgica os dados solicitados.

Campos obrigatórios para extração:
1. cliente: Nome completo da pessoa física segurada ou Razão Social da empresa proponente.
2. clienteCnpj: CPF (ex: 000.000.000-00) ou CNPJ (ex: 00.000.000/0001-00) se estiver presente no documento. Se não encontrar, retorne null.
3. clienteEmail: E-mail de contato do cliente/empresa. Se não houver, retorne null.
4. clienteTelefone: Telefone com DDD. Se não houver, retorne null.
5. valorTotal: O valor monetário total do prêmio da cotação (apenas número em ponto flutuante, ex: 4500.50). Não inclua 'R$'. Se houver opção parcelada e à vista, use o valor total anual/mensal principal da proposta.
6. seguradora: Nome da seguradora responsável (ex: 'Porto Seguro', 'SulAmérica', 'Allianz', 'Bradesco Seguros', 'Tokio Marine', 'Mapfre', etc.).
7. produtos: Lista (array de strings) com os principais produtos, planos e coberturas contratadas (ex: ['Seguro Auto Compreensiva 100% FIPE', 'Carro Reserva Plus', 'Danos Morais R$ 50k']).
8. dataCotacao: Data de emissão ou cálculo da cotação no formato YYYY-MM-DD. Se não houver, retorne a data atual.
9. ramo: Identifique o ramo principal do seguro (ex: 'Automóvel', 'Saúde PME', 'Saúde Corporativo', 'Vida Individual', 'Vida em Grupo', 'Empresarial', 'Residencial', 'Transportes & Frotas', 'Riscos de Engenharia', 'Odontológico', 'Responsabilidade Civil').
10. resumoCoberturas: Uma síntese executiva clara (1 ou 2 frases) sobre as principais condições, franquia e vantagens comerciais da cotação.
11. confiancaIa: Grau estimado de confiança na extração (número inteiro de 80 a 99).

IMPORTANTE: Retorne rigorosamente um JSON estruturado conforme o esquema definido.`;

      let parts: any[] = [{ text: systemPrompt }];

      if (fileBase64) {
        // Remove data URL prefix if present
        const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, '');
        parts.push({
          inlineData: {
            data: cleanBase64,
            mimeType: mimeType || 'application/pdf',
          },
        });
        parts.push({
          text: `Extraia os dados desta cotação de seguro do arquivo "${fileName}". Retorne estritamente o JSON.`
        });
      } else if (rawText) {
        parts.push({
          text: `Texto da cotação:\n"""\n${rawText}\n"""\nExtraia os dados desta cotação de seguro. Retorne estritamente o JSON.`
        });
      }

      // Call Gemini 3.7 Flash with structured schema
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: { parts },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              cliente: { type: Type.STRING, description: 'Nome do cliente ou Razão Social' },
              clienteCnpj: { type: Type.STRING, description: 'CPF ou CNPJ formatado' },
              clienteEmail: { type: Type.STRING, description: 'E-mail do segurado' },
              clienteTelefone: { type: Type.STRING, description: 'Telefone de contato' },
              valorTotal: { type: Type.NUMBER, description: 'Valor total do prêmio em reais' },
              seguradora: { type: Type.STRING, description: 'Nome da companhia seguradora' },
              produtos: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Lista de coberturas e produtos inclusos'
              },
              dataCotacao: { type: Type.STRING, description: 'Data da cotação YYYY-MM-DD' },
              ramo: { type: Type.STRING, description: 'Ramo do seguro' },
              resumoCoberturas: { type: Type.STRING, description: 'Resumo das condições e coberturas' },
              confiancaIa: { type: Type.INTEGER, description: 'Nível de precisão estimado de 0 a 100' }
            },
            required: ['cliente', 'valorTotal', 'seguradora', 'produtos']
          },
          temperature: 0.1,
        }
      });

      const responseText = response.text || '{}';
      const extractedData = JSON.parse(responseText);

      return res.json({
        success: true,
        data: extractedData,
        source: 'gemini-3.7-flash',
        extractedAt: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Erro na extração Gemini:', error);
      return res.status(500).json({
        error: 'Erro ao processar extração com a IA Gemini.',
        details: error?.message || 'Falha desconhecida',
      });
    }
  });

  // Simulate incoming email forwarded to cotacoes@corretora.com
  app.post('/api/simulate-email', async (req, res) => {
    try {
      const { senderEmail, subject, attachmentName, samplePresetIndex } = req.body;

      // Generates a mock email received with processed quote
      res.json({
        success: true,
        messageId: `msg_${Date.now()}`,
        receivedAt: new Date().toISOString(),
        inbox: 'cotacoes@segurflow.com.br',
        sender: senderEmail || 'vendedor@segurflow.com.br',
        subject: subject || 'Encaminhamento: Cotação de Seguro Cliente Novo',
        attachment: attachmentName || 'cotacao_seguro.pdf',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SegurFlow Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
