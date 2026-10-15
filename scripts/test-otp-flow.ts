import 'dotenv/config';
import { auth } from '../src/lib/auth';
import prisma from '../src/lib/prisma';

async function testOtpFlow() {
  console.log('--- Testing Better Auth Email OTP Flow ---');
  const testEmail = `patron.${Date.now()}@rajwadi-test.com`;

  console.log(`\n1. Sending verification OTP to: ${testEmail}`);
  const sendResult = await auth.api.sendVerificationOTP({
    body: {
      email: testEmail,
      type: 'sign-in',
    },
  });
  console.log('✓ sendVerificationOTP response:', sendResult);

  // Retrieve the generated OTP from the database Verification table
  const verification = await prisma.verification.findFirst({
    where: { identifier: `sign-in-otp-${testEmail}` },
    orderBy: { createdAt: 'desc' },
  });

  if (!verification) {
    console.error('✗ Verification record not found in database');
    process.exit(1);
  }

  const generatedOtp = verification.value.split(':')[0];
  console.log(`✓ Verification record found in DB. OTP: ${generatedOtp} (Expires: ${verification.expiresAt})`);

  console.log('\n2. Verifying OTP and signing in...');
  const signInResult = await auth.api.signInEmailOTP({
    body: {
      email: testEmail,
      otp: generatedOtp,
    },
  });

  console.log('✓ signInEmailOTP response user:', signInResult?.user?.email, 'ID:', signInResult?.user?.id);
  console.log('\n=======================================================');
  console.log(' ✓ EMAIL OTP LOGIN & SIGN-UP FLOW VERIFIED SUCCESSFULLY');
  console.log('=======================================================');
}

testOtpFlow()
  .catch((err) => {
    console.error('OTP flow test failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
