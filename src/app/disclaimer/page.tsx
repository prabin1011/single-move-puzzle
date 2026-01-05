import LegalLayout from '@/components/legal-layout';

export default function DisclaimerPage() {
  return (
    <LegalLayout title="Disclaimer">
      <div className="space-y-4 text-muted-foreground">
        <p>
          The information and games provided by One Move Puzzle are for general informational and entertainment purposes only. All information on the site and within our mobile application is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information.
        </p>
        <p>
          The games are designed to be educational and challenging, but they are not a substitute for professional advice, formal education, or cognitive therapy. The facts and data presented within the games are sourced from public information and may contain occasional inaccuracies or become outdated.
        </p>
        <p>
          UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR OUR MOBILE APPLICATION OR RELIANCE ON ANY INFORMATION PROVIDED. YOUR USE OF THE APP AND YOUR RELIANCE ON ANY INFORMATION IS SOLELY AT YOUR OWN RISK.
        </p>
        <p>
          The app may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
        </p>
      </div>
    </LegalLayout>
  );
}
