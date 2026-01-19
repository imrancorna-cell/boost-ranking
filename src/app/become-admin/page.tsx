'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CodeBlock } from '@/components/code-block';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import Link from 'next/link';

const packageJsonCode = `{
  "dependencies": {
    "firebase-admin": "^12.0.0"
  }
}`;

const setAdminCode = `const admin = require('firebase-admin');

// This script needs a service account key to work.
// Download it from your Firebase project settings.
const serviceAccount = require('./serviceAccountKey.json');

const userEmail = process.argv[2];

if (!userEmail) {
  console.error('Error: Please provide the user\\'s email as an argument.');
  console.log('Usage: node set-admin.js <user-email@example.com>');
  process.exit(1);
}

// Initialize the Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (error) {
  if (error.code !== 'app/duplicate-app') {
    console.error('Firebase Admin SDK initialization error:', error);
    process.exit(1);
  }
}

async function setAdminClaim(email) {
  try {
    // Look up the user by email
    const user = await admin.auth().getUserByEmail(email);

    // Get existing custom claims
    const existingClaims = user.customClaims || {};

    if (existingClaims.isAdmin) {
      console.log(\`\${email} is already an admin.\`);
      process.exit(0);
    }

    // Set the isAdmin claim to true
    await admin.auth().setCustomUserClaims(user.uid, {
      ...existingClaims,
      isAdmin: true,
    });

    console.log(\`Success! \${email} has been made an admin.\`);
    console.log('Please log out and log back in for the changes to take effect.');
    process.exit(0);
  } catch (error) {
    console.error('Error setting custom claim:', error.message);
    process.exit(1);
  }
}

setAdminClaim(userEmail);
`;

export default function BecomeAdminPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Become an Administrator
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            A one-time setup to grant yourself admin privileges.
          </p>
        </div>

        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Security Notice</AlertTitle>
          <AlertDescription>
            This process involves handling a sensitive credential (a service
            account key). Do not share this key or commit it to version control.
            It provides powerful access to your Firebase project.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Step 1: Create Your User Account</CardTitle>
            <CardDescription>
              If you haven't already, sign up for an account on the login page.
              This is the account you will promote to an admin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login" className="text-primary hover:underline">
              Go to the Login/Sign Up page &rarr;
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Prepare a Local Script</CardTitle>
            <CardDescription>
              On your local computer, create a new, temporary folder to run a
              script. Let's call it <code className="font-mono">admin_script</code>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Inside that folder, create a file named{' '}
              <code className="font-mono">package.json</code> and paste the
              following content:
            </p>
            <CodeBlock code={packageJsonCode} language="json" />
            <p>
              Now, open a terminal or command prompt inside the{' '}
              <code className="font-mono">admin_script</code> folder and run:
            </p>
            <CodeBlock code="npm install" language="bash" />
            <p>This will install the necessary Firebase Admin SDK.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 3: Get Your Service Account Key</CardTitle>
            <CardDescription>
              This key allows your script to securely access your Firebase
              project.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Open the{' '}
                <a
                  href="https://console.firebase.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Firebase Console
                </a>
                .
              </li>
              <li>
                Select your project (<code className="font-mono">bosstranking</code>).
              </li>
              <li>
                Click the gear icon next to 'Project Overview' and go to{' '}
                <strong>Project settings</strong>.
              </li>
              <li>
                Go to the <strong>Service accounts</strong> tab.
              </li>
              <li>
                Click the <strong>Generate new private key</strong> button.
              </li>
              <li>
                A file will be downloaded. Rename it to{' '}
                <code className="font-mono">serviceAccountKey.json</code> and
                move it into your{' '}
                <code className="font-mono">admin_script</code> folder.
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 4: Create and Run the Admin Script</CardTitle>
            <CardDescription>
              This script will find your user and give it the admin role.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Create a new file named{' '}
              <code className="font-mono">set-admin.js</code> inside your{' '}
              <code className="font-mono">admin_script</code> folder and paste
              this code into it:
            </p>
            <CodeBlock code={setAdminCode} language="javascript" />
            <p>
              Now, run the script from your terminal, replacing{' '}
              <code className="font-mono">you@example.com</code> with the email
              you used to sign up:
            </p>
            <CodeBlock
              code="node set-admin.js you@example.com"
              language="bash"
            />
            <p>You should see a success message.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 5: You're Done!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              The `isAdmin` claim has been set. You may need to log out and log
              back in. Afterward, you will be able to access the admin
              dashboard.
            </p>
            <div className="mt-4">
              <Link href="/admin" className="text-primary hover:underline">
                Try accessing the Admin Panel now &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
