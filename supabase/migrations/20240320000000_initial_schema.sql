-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables and objects (in correct order)
DROP TABLE IF EXISTS indicacoes CASCADE;
DROP TABLE IF EXISTS partners CASCADE;
DROP TABLE IF EXISTS ranking CASCADE;
DROP TABLE IF EXISTS resgates CASCADE;
DROP TABLE IF EXISTS recompensas CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'partner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create partners table
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rank TEXT NOT NULL DEFAULT 'Bronze',
  points INTEGER NOT NULL DEFAULT 0,
  total_indicacoes INTEGER NOT NULL DEFAULT 0,
  indicacoes_fechadas INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indicacoes table
CREATE TABLE indicacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  tipo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente',
  observacoes TEXT,
  data_indicacao TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT fk_partner FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE
);

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicacoes ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR ALL USING (is_admin(auth.uid()));

-- Partners policies
CREATE POLICY "Partners can view their own data" ON partners
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Partners can update their own data" ON partners
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all partners" ON partners
  FOR ALL USING (is_admin(auth.uid()));

-- Indicacoes policies
CREATE POLICY "Partners can view their own indicacoes" ON indicacoes
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ));

CREATE POLICY "Partners can insert their own indicacoes" ON indicacoes
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ));

CREATE POLICY "Partners can update their own indicacoes" ON indicacoes
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM partners WHERE id = partner_id
  ));

CREATE POLICY "Admins can manage all indicacoes" ON indicacoes
  FOR ALL USING (is_admin(auth.uid()));

-- Create functions
CREATE OR REPLACE FUNCTION update_partner_points()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'Fechado' AND OLD.status != 'Fechado' THEN
    UPDATE partners
    SET 
      points = points + 10,
      indicacoes_fechadas = indicacoes_fechadas + 1,
      updated_at = NOW()
    WHERE id = NEW.partner_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_partner_points_trigger ON indicacoes;
CREATE TRIGGER update_partner_points_trigger
AFTER UPDATE ON indicacoes
FOR EACH ROW
EXECUTE FUNCTION update_partner_points();

-- Create admin users
INSERT INTO users (email, name, role)
VALUES 
  ('felipe@pedireitoimoveis.com.br', 'Felipe', 'admin'),
  ('contato@pedireitoimoveis.com.br', 'Contato', 'admin')
ON CONFLICT (email) DO NOTHING; 