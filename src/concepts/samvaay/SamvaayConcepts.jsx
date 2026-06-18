import {
  ConceptProse,
  ConceptCallout,
  ConceptSplit,
  ConceptSplitItem,
  DefinitionList,
} from '../../components/prose/ConceptProse';

const SAMVAYAS = [
  {
    term: 'Upādāna — material cause',
    definition:
      'The substance the result is actually made from. Rice needs a rice seed, not sand. A pot needs clay, not stone. Wrong material, wrong outcome — no matter how hard you try.',
  },
  {
    term: 'Purushārtha — effort',
    definition:
      'Your deliberate work: planting, shaping, studying, practicing. Necessary, visible, and under your control — but never the whole story.',
  },
  {
    term: 'Kāla — time',
    definition:
      'Some results cannot be rushed. A bone needs weeks to mend; rice needs a full season. The right action at the wrong time still fails.',
  },
  {
    term: 'Svabhāva — nature',
    definition:
      'The intrinsic properties of what you started with. A seed carries its own limits. Clay has its own temperament on the wheel. You work with nature; you do not override it by will alone.',
  },
  {
    term: 'Niyati — order',
    definition:
      'Background conditions that must quietly fall into place — weather, context, timing of the wider world. You prepare, but the environment must cooperate too.',
  },
  {
    term: 'Karma — prior momentum',
    definition:
      'Invisible weight from what came before: habits, history, accumulated causes. It can ease a path or block one even when everything else looks right.',
  },
];

export default function SamvaayConcepts() {
  return (
    <ConceptProse>
      <p>
        In Jain thought, a <strong>samvāya</strong> is a condition that must be present for something
        to happen. No harvest comes from effort alone. Seed, soil, season, time, and countless hidden
        factors all participate. The laboratory walks you through this — then asks a second question:
        when the result finally appears, what happens inside you?
      </p>

      <ConceptCallout>
        <p>
          <strong>The split this concept teaches:</strong> external success (did the world cooperate?)
          and internal success (did awareness stay free?) are independent. You can have one without the
          other.
        </p>
      </ConceptCallout>

      <h2>What has to align for a result?</h2>
      <p>
        When you run an experiment in the laboratory, you work through the main conditions Jain
        philosophy names. Together they explain why the same effort sometimes works and sometimes does
        not.
      </p>
      <DefinitionList items={SAMVAYAS} />

      <h2>Material cause vs. instrumental cause</h2>
      <p>
        Jain philosophy also distinguishes <em>what</em> becomes the result from <em>who or what</em>{' '}
        helps it along.
      </p>
      <ul>
        <li>
          <strong>Upādāna</strong> (material): seed becomes plant, clay becomes pot, living bone
          tissue enables healing.
        </li>
        <li>
          <strong>Nimitta</strong> (instrumental): the farmer tends the field, the potter turns the
          wheel, the doctor sets the bone — they enable the change but are not the substance of the
          result itself.
        </li>
      </ul>
      <p>
        Confusing the two leads to wasted effort: polishing technique when the wrong material was
        chosen, or blaming the farmer when the seed was never viable.
      </p>

      <h2>When the outcome arrives</h2>
      <p>
        After all conditions play out, you still choose how to meet the result. The laboratory ends
        with this fork:
      </p>
      <ConceptSplit>
        <ConceptSplitItem title="Reactive loop">
          Success inflates you; failure diminishes you. Pride, blame, anxiety, and craving follow the
          result — happiness becomes hostage to what happened outside.
        </ConceptSplitItem>
        <ConceptSplitItem title="Knower-seer">
          You register the outcome clearly without fusing with it. The result is seen; awareness itself
          is not won or lost by it.
        </ConceptSplitItem>
      </ConceptSplit>
      <p className="mt-6 text-sm text-stone-500">
        Open the <strong>Laboratory</strong> tab to run a scenario and feel this distinction directly.
      </p>
    </ConceptProse>
  );
}
