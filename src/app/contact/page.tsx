import LegalLayout from '@/components/legal-layout';
import { Mail } from 'lucide-react';

export default function ContactPage() {
  return (
    <LegalLayout title="Contact Us">
      <div className="space-y-4 text-muted-foreground">
        <p>
          We welcome your feedback, questions, and suggestions. If you need to get in touch with us, please feel free to send an email.
        </p>
        <p>
          For all inquiries, please contact us at:
        </p>
        <a
          href="mailto:hello@onemovepuzzle.com"
          className="flex items-center justify-center rounded-md bg-secondary p-4 text-lg font-semibold text-primary transition-colors hover:bg-secondary/80"
        >
          <Mail className="mr-3 h-6 w-6" />
          hello@onemovepuzzle.com
        </a>
        <p>
          We do our best to respond to all messages as quickly as possible. Thank you for your interest in One Move Puzzle!
        </p>
      </div>
    </LegalLayout>
  );
}
