import FaqSection from '../../components/faq/FaqSection';
import faqData from './faq.json';

export default function FAQ() {
  return (
    <FaqSection intro="Common questions after going through the lab." items={faqData} />
  );
}
