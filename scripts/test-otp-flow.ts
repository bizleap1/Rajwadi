import 'dotenv/config';
import { auth } from '../src/lib/auth';
import prisma from '../src/lib/prisma';

async function testAuthFlow() {
  console.log('--- Testing Standard Credentials Sign-Up & Sign-In Flow ---');
  const testEmail = `patron.${Date.now()}@rajwadi-test.com`;
  const testPassword = 'RajwadiPassword2026!';
  const testName = 'Test Patron';

  console.log(`\n1. Creating test patron account: ${testEmail}`);
  const signUpResult = await auth.api.signUpEmail({
    body: {
      name: testName,
      email: testEmail,
      password: testPassword,
    },
  });
  console.log('✓ signUpEmail response user:', signUpResult?.user?.email, 'ID:', signUpResult?.user?.id);

  console.log('\n2. Signing in with email and password...');
  const signInResult = await auth.api.signInEmail({
    body: {
      email: testEmail,
      password: testPassword,
    },
  });

  console.log('✓ signInEmail response user:', signInResult?.user?.email, 'ID:', signInResult?.user?.id);
  console.log('\n=============================================================');
  console.log(' ✓ STANDARD CREDENTIALS FLOW VERIFIED SUCCESSFULLY');
  console.log('=============================================================');
}

testAuthFlow()
  .catch((err) => {
    console.error('Auth flow test failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
