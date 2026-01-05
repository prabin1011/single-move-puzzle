import LegalLayout from '@/components/legal-layout';

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <div className="space-y-6 text-muted-foreground">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">1. Introduction</h2>
          <p>
            Welcome to One Move Puzzle. We are committed to protecting your privacy. This Privacy Policy explains how we handle your information when you use our mobile application. Our policy is simple: we do not collect, store, or share any of your personal data.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">2. Information We Do Not Collect</h2>
          <p>
            We do not require you to create an account or provide any personal information to play our game. We do not collect, track, or store any data that can be used to personally identify you, such as:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
            <li>Your name, email address, or phone number.</li>
            <li>Your device ID, advertising ID, or IP address.</li>
            <li>Your location data.</li>
            <li>Any information from your contacts, photos, or other apps.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">3. Locally Stored Data (On Your Device)</h2>
          <p>
            To save your game progress, such as your current level and highest achieved level, our application uses your device&apos;s local storage. This information is stored exclusively on your device and is never transmitted to us or any third party. It is entirely under your control. If you uninstall the application, this data will be permanently deleted.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">4. Anonymous Authentication</h2>
          <p>
            We use Firebase Anonymous Authentication to provide a seamless game experience without requiring you to sign up. This service creates a temporary, anonymous user ID that allows your game state to be functional. This ID is not linked to any personal information and cannot be used to identify you.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">5. Children&apos;s Privacy</h2>
          <p>
            Our application is designed for a general audience and does not knowingly collect any personal information from children. Since we do not collect personal information of any kind, we are in full compliance with laws protecting children’s privacy, such as the Children&apos;s Online Privacy Protection Act (COPPA).
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">6. Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, you can contact us at <a href="mailto:hello@onemovepuzzle.com" className="text-primary hover:underline">hello@onemovepuzzle.com</a>.
          </p>
        </div>
      </div>
    </LegalLayout>
  );
}
