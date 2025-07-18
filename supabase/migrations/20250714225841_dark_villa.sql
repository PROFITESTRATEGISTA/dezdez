/*
  # Seed initial data for the system

  1. Create initial plans
  2. Create sample admin user
  3. Insert sample data for testing
*/

-- Insert initial plans
INSERT INTO plans (name, description, base_price, age_min, age_max, coverage_details, is_active) VALUES
(
  'Dez Emergências Básico',
  'Plano básico de emergências médicas 24h',
  59.00,
  0,
  39,
  '{
    "coverage": [
      "Atendimento domiciliar 24h",
      "Orientação médica por telefone",
      "Mais de 40 ocorrências de emergência",
      "Remoção em ambulância",
      "Cobertura em São Paulo e Grande SP"
    ],
    "emergencies": [
      "Infarto agudo do miocárdio",
      "Acidente vascular cerebral (AVC)",
      "Crise hipertensiva",
      "Crise asmática grave",
      "Convulsões",
      "Traumatismo craniano",
      "Fraturas expostas",
      "Hemorragias graves",
      "Intoxicação aguda",
      "Queimaduras graves"
    ]
  }',
  true
),
(
  'Dez Emergências Adulto',
  'Plano para adultos de 40-59 anos',
  79.00,
  40,
  59,
  '{
    "coverage": [
      "Atendimento domiciliar 24h",
      "Orientação médica por telefone",
      "Mais de 40 ocorrências de emergência",
      "Remoção em ambulância UTI",
      "Cobertura em São Paulo e Grande SP",
      "Atendimento cardiológico especializado"
    ]
  }',
  true
),
(
  'Dez Emergências Senior',
  'Plano para idosos 60+ anos',
  129.00,
  60,
  120,
  '{
    "coverage": [
      "Atendimento domiciliar 24h",
      "Orientação médica por telefone",
      "Mais de 40 ocorrências de emergência",
      "Remoção em ambulância UTI",
      "Cobertura em São Paulo e Grande SP",
      "Atendimento geriátrico especializado",
      "Suporte para doenças crônicas"
    ]
  }',
  true
);

-- Note: Admin users will be created through the application interface
-- The auth.users table is managed by Supabase Auth