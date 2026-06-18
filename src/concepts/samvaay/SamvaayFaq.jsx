import FaqSection from '../../components/faq/FaqSection';

const FAQ_ITEMS = [
  {
    question: 'Does this mean everything is predetermined?',
    answer:
      'No. Many conditions matter, and not all are visible. Some factors lie beyond your effort, but how you respond inwardly — and how much effort you bring — remains meaningful.',
  },
  {
    question: 'Where does free will exist?',
    answer:
      'In effort, direction, and posture toward results. You cannot command every external condition, but you can choose whether to become attached to success or failure.',
  },
  {
    question: 'Why can effort fail?',
    answer:
      'Because effort is one samvāya among several. Wrong material, wrong timing, unfavorable conditions, or hidden momentum can all prevent an outcome even when you tried sincerely.',
  },
  {
    question: 'How is this useful in daily life?',
    answer:
      'It loosens the grip of outcomes on your identity. You can plan and work fully while holding that the result depends on more than you — and that your clarity need not rise and fall with it.',
  },
];

export default function SamvaayFaq() {
  return (
    <FaqSection intro="Common questions after going through the lab." items={FAQ_ITEMS} />
  );
}
