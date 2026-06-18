import { STEP_NAMES } from '../data';
import { showContinueStep, continueLabel, canAdvanceFrom } from '../useSamvaayLab';

function Narrative({ story }) {
  return (
    <p className="text-stone-500 text-sm uppercase tracking-[0.24em] mb-4">{story}</p>
  );
}

function OptionButton({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-3xl border p-5 text-left hover:border-emerald-400 transition ${
        selected
          ? 'border-emerald-500 bg-emerald-500/10'
          : 'border-stone-200 bg-stone-50/80'
      }`}
    >
      {children}
    </button>
  );
}

function StepContent({ step, scenario, answers, onSelectUpadana, onSelectKala, onIncrementEffort }) {
  const narrative = <Narrative story={scenario.story} />;

  if (step === 0) {
    return (
      <>
        {narrative}
        <p className="text-lg font-semibold">What is the material cause?</p>
        <div className="grid gap-4 sm:grid-cols-2 mt-5">
          {scenario.upadana.map((item) => (
            <OptionButton
              key={item}
              selected={answers.upadana === item}
              onClick={() => onSelectUpadana(item)}
            >
              {item}
            </OptionButton>
          ))}
        </div>
      </>
    );
  }

  if (step === 1) {
    return (
      <>
        {narrative}
        <p className="text-lg font-semibold">Svabhāva</p>
        <p className="mt-4 text-stone-700 leading-7">
          The intrinsic nature of the chosen cause. This step reminds you that some properties belong
          to the material itself, not to your effort.
        </p>
        <div className="mt-6 rounded-3xl border border-stone-200 bg-stone-100 p-6">
          <p className="text-stone-500">
            Intrinsic nature is stable and present even before the result appears. It is part of the
            causal field, not the final result.
          </p>
        </div>
      </>
    );
  }

  if (step === 2) {
    return (
      <>
        {narrative}
        <p className="text-lg font-semibold">How much time is required?</p>
        <div className="grid gap-4 sm:grid-cols-2 mt-5">
          {scenario.kala.map((item) => (
            <OptionButton
              key={item}
              selected={answers.kala === item}
              onClick={() => onSelectKala(item)}
            >
              {item}
            </OptionButton>
          ))}
        </div>
      </>
    );
  }

  if (step === 3) {
    return (
      <>
        {narrative}
        <p className="text-lg font-semibold">Niyati</p>
        <p className="mt-4 text-stone-700 leading-7">
          Order and necessity. Some conditions must align quietly in the background. You cannot see
          them directly, but they are part of whether the experiment succeeds.
        </p>
        <div className="mt-6 rounded-3xl border border-stone-200 bg-stone-100 p-6">
          <p className="text-stone-500">
            This is a hidden condition. You can prepare, but the world still needs to cooperate.
          </p>
        </div>
      </>
    );
  }

  if (step === 4) {
    return (
      <>
        {narrative}
        <p className="text-lg font-semibold">Karma</p>
        <p className="mt-4 text-stone-700 leading-7">
          Invisible causal weight from prior actions. It can support or hinder the experiment even if
          everything else looks right.
        </p>
        <div className="mt-6 rounded-3xl border border-stone-200 bg-stone-100 p-6">
          <p className="text-stone-500">Karma is unseen, but it changes the likelihood of success.</p>
        </div>
      </>
    );
  }

  if (step === 5) {
    return (
      <>
        {narrative}
        <p className="text-lg font-semibold">Purushārtha</p>
        <p className="mt-3 text-stone-500 leading-7">
          Effort is visible. Click to make effort. The final outcome still depends on other conditions.
        </p>
        <div className="mt-8 rounded-[2rem] border border-stone-200 bg-stone-100 p-10 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Effort</p>
          <p className="mt-4 text-6xl font-semibold text-amber-500">{answers.effort}</p>
          <p className="mt-4 text-stone-500 leading-7 max-w-xl mx-auto">
            You can stop whenever you want and proceed. Sometimes the required purushārtha for the same
            work can vary. You never know how much of it was actually required.
          </p>
          <button
            type="button"
            onClick={onIncrementEffort}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-amber-300 px-8 py-4 text-sm font-semibold text-stone-900 hover:bg-amber-200"
          >
            MAKE EFFORT
          </button>
        </div>
      </>
    );
  }

  return null;
}

export default function StepJourney({
  step,
  scenario,
  answers,
  onGoToStep,
  onStepBack,
  onAdvance,
  onSelectUpadana,
  onSelectKala,
  onIncrementEffort,
}) {
  const handleSelectUpadana = (item) => onSelectUpadana(item, step);
  const handleSelectKala = (item) => onSelectKala(item, step);

  return (
    <>
      <div className="rounded-3xl border border-stone-200 bg-stone-50 p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-stone-500 uppercase text-xs tracking-[0.24em]">Progress tracker</p>
            <h3 className="mt-2 text-xl font-semibold">{STEP_NAMES[step]}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {STEP_NAMES.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => onGoToStep(index)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  index === step
                    ? 'bg-amber-300 text-stone-900'
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-stone-200 bg-stone-50 p-6 space-y-6">
        <StepContent
          step={step}
          scenario={scenario}
          answers={answers}
          onSelectUpadana={handleSelectUpadana}
          onSelectKala={handleSelectKala}
          onIncrementEffort={onIncrementEffort}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={() => onStepBack(step)}
          className="rounded-full border border-stone-300 px-5 py-3 text-sm hover:border-stone-400"
        >
          Back
        </button>
        {showContinueStep(step) && (
          <button
            type="button"
            onClick={() => onAdvance(step)}
            disabled={!canAdvanceFrom(step, answers)}
            className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-stone-900 hover:bg-amber-200 disabled:opacity-50"
          >
            {continueLabel(step)}
          </button>
        )}
      </div>
    </>
  );
}
