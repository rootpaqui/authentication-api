import { existsSync, readFileSync, writeFileSync } from 'fs';
import { randomBytes } from 'crypto';
import { join } from 'path';

const accessSecretKey = randomBytes(32).toString('hex');
const refreshSecretKey = randomBytes(32).toString("hex");

console.log(`Secret keys generated successfully!\n \nAccess key: ${accessSecretKey} \nRefresh key: ${refreshSecretKey}`);



// const envPath = join(process.cwd(), ".env");
// let envContent = '';
// if (existsSync(envPath)) {
//     envContent = readFileSync(envPath, 'utf8');
// }
// const newEnvContent = envContent.replace(/ACCESS_TOKEN_SECRET=.*/g, `ACCESS_TOKEN_SECRET=${secretKey}`);
// if (!newEnvContent.includes('ACCESS_TOKEN_SECRET=')) {
//     envContent += `\nACCESS_TOKEN_SECRET=${secretKey}\n`;
// }
// writeFileSync(envPath, newEnvContent || `ACCESS_TOKEN_SECRET=${secretKey}\n`, 'utf8');