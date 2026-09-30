// import "dotenv/config";
// import { Pool } from "pg";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "@/generated/prisma/client";
// import socios from "./socios.json";

// const connectionString = process.env.DATABASE_URL;

// if (!connectionString) {
//   throw new Error("DATABASE_URL is not defined");
// }

// const pool = new Pool({
//   connectionString,
// });

// const adapter = new PrismaPg(pool);
// const prisma = new PrismaClient({ adapter });

// type Socio = {
//   name: string;
//   email: string | null;
//   studentNumber: string | null;
//   phoneNumber: string | null;
//   since: string | null;
//   memberNumber: number;
// };

// async function main() {
//   const data = socios as Socio[];

//   let created = 0;
//   let updated = 0;
//   let semEmail = 0;

//   for (const socio of data) {
//     if (!socio.email) semEmail++;

//     const payload = {
//       name: socio.name,
//       studentNumber: socio.studentNumber,
//       phoneNumber: socio.phoneNumber,
//       since: socio.since ? new Date(socio.since) : null,
//       memberNumber: socio.memberNumber,
//     };

//     let result;

//     if (socio.email) {
//       // com email: upsert normal usando o email como chave única
//       result = await prisma.user.upsert({
//         where: { email: socio.email },
//         update: payload,
//         create: { ...payload, email: socio.email },
//       });
//     } else {
//       // sem email: usar o memberNumber (único) como chave de deduplicação
//       const existing = await prisma.user.findFirst({
//         where: { memberNumber: socio.memberNumber },
//       });

//       result = existing
//         ? await prisma.user.update({ where: { id: existing.id }, data: payload })
//         : await prisma.user.create({ data: { ...payload, email: null } });
//     }

//     if (result.createdAt.getTime() === result.updatedAt.getTime()) {
//       created++;
//     } else {
//       updated++;
//     }
//   }

//   console.log(`Sócios processados: ${data.length}`);
//   console.log(`  - criados/atualizados via upsert: ${created} criados, ${updated} atualizados (heurística)`);
//   console.log(`  - sem email: ${semEmail}`);
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//     await pool.end();
//   })
//   .catch(async (error) => {
//     console.error(error);
//     await prisma.$disconnect();
//     await pool.end();
//     process.exit(1);
//   });
