import FaqSection from '../faq/FaqSection';

export default function FaqRenderer({ items }) {
  return <FaqSection intro="Common questions after going through the lab." items={items} />;
}
