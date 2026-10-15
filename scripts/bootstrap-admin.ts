import "dotenv/config";
import { auth } from "../src/lib/auth";
import prisma from "../src/lib/prisma";

async function bootstrapAdmin() {
  const email = (process.argv[2] || process.env.ADMIN_EMAIL || "owner@rajwadi.com").trim().toLowerCase();
  const password = process.argv[3] || process.env.ADMIN_PASSWORD || "RajwadiOwner2026!Secure";
  const name = process.argv[4] || process.env.ADMIN_NAME || "Rajwadi Owner";

  console.log(`\n========================================`);
  console.log(`  RAJWADI OWNER ADMIN BOOTSTRAP`);
  console.log(`========================================`);
  console.log(`Target Email: ${email}`);
  console.log(`Admin Name:   ${name}`);

  if (password.length < 8) {
    console.error(`\n❌ Error: Admin password must be at least 8 characters.`);
    process.exit(1);
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`\nExisting user found (ID: ${existingUser.id}). Promoting to ADMIN role...`);
      
      // Update role to ADMIN
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          role: "ADMIN",
          name,
        },
      });

      // Update credential account password if provided
      const credentialAccount = await prisma.account.findFirst({
        where: {
          userId: existingUser.id,
          providerId: "credential",
        },
      });

      if (credentialAccount) {
        // Hash new password using Better Auth password hasher or bcrypt
        const ctx = await auth.$context;
        const hashedPassword = await ctx.password.hash(password);
        await prisma.account.update({
          where: { id: credentialAccount.id },
          data: { password: hashedPassword },
        });
        console.log(`Updated credential password for existing admin.`);
      }

      console.log(`\n✅ Admin account "${email}" updated successfully with ADMIN role!`);
    } else {
      console.log(`\nCreating new admin account with email "${email}"...`);
      
      // Sign up via Better Auth API
      const result = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name,
        },
      });

      if (result && result.user) {
        // Elevate newly created user to ADMIN role
        await prisma.user.update({
          where: { id: result.user.id },
          data: {
            role: "ADMIN",
          },
        });
        console.log(`\n✅ Admin user created successfully (ID: ${result.user.id}) with ADMIN role!`);
      } else {
        console.error(`\n❌ Failed to create admin account.`);
        process.exit(1);
      }
    }

    console.log(`\nYou can now log in at: http://localhost:3000/admin/login`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${"*".repeat(password.length)}`);
    console.log(`========================================\n`);
  } catch (error) {
    console.error(`\n❌ Bootstrap error:`, error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

bootstrapAdmin();
