// prisma/seed.ts
// Este script cria o usuário administrador inicial no banco de dados.

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      'Por favor, defina ADMIN_EMAIL e ADMIN_PASSWORD no seu arquivo .env.local'
    );
  }

  // Criptografa a senha antes de salvar
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Deleta o usuário admin se ele já existir
  await prisma.user.delete({ where: { email: adminEmail } }).catch(() => {
    // Ignora o erro se o usuário não for encontrado
  });

  // Cria o novo usuário administrador
  const adminUser = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: adminEmail,
      password_hash: hashedPassword,
      roles: ['admin', 'consultor'], // Define as permissões
    },
  });

  console.log('Usuário administrador criado com sucesso:');
  console.log(adminUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
