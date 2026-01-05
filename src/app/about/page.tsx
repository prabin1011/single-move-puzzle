import LegalLayout from '@/components/legal-layout';

export default function AboutPage() {
  return (
    <LegalLayout title="About One Move Puzzle">
      <div className="space-y-4 text-muted-foreground">
        <p>
          One Move Puzzle was born from a simple idea: to create a space for calm, thoughtful, and engaging mental exercise. In a world of constant noise and distraction, we wanted to build an experience that helps you focus, learn, and relax, all at the same time.
        </p>
        <p>
          Our puzzles are more than just games; they are carefully crafted educational tools. Whether you&apos;re exploring world landmarks, sharpening your mathematical intuition, recognizing complex patterns, or deepening your understanding of language, each puzzle is designed to be a rewarding mental workout.
        </p>
        <p>
          We believe in the power of play to make learning feel effortless. Our mission is to provide high-quality, peaceful, and intellectually stimulating entertainment for curious minds of all ages.
        </p>
        <p>
          Thank you for playing and being a part of our community.
        </p>
      </div>
    </LegalLayout>
  );
}
